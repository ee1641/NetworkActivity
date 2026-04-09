package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Block;
import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Block;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.BlockRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

/**
 * Pulls live blocks from VeChain via the thor-sdk and stores transactions in the DB.
 *
 * On first startup (empty DB): backfills INITIAL_BACKFILL_BLOCKS of history.
 * On restart: resumes from the max block_number already stored.
 * Live sync: stays within LIVE_THRESHOLD blocks of the chain head.
 */
@Service
public class TransactionIngestionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionIngestionService.class);

    /** Blocks of history to backfill when DB is empty (~24 h at 10 s/block). */
    private static final int INITIAL_BACKFILL_BLOCKS = 8_640;

    /** Blocks to process per scheduled run during catch-up. */
    private static final int CATCHUP_BATCH = 50;

    /** Blocks to process per scheduled run during live sync. */
    private static final int LIVE_BATCH = 5;

    /** Switch to live-batch mode when this close to head. */
    private static final int LIVE_THRESHOLD = 20;

    private final VeChainThorClient thorClient;
    private final TransactionRepository transactionRepository;
    private final BlockRepository blockRepository;
    private final AddressRepository addressRepository;

    private Long lastIngestedBlock = null;
    private boolean initialized = false;

    public TransactionIngestionService(VeChainThorClient thorClient,
                                       TransactionRepository transactionRepository,
                                       BlockRepository blockRepository,
                                       AddressRepository addressRepository) {
        this.thorClient = thorClient;
        this.transactionRepository = transactionRepository;
        this.blockRepository = blockRepository;
        this.addressRepository = addressRepository;
    }

    @Scheduled(fixedRate = 10_000)
    public void ingest() {
        try {
            var summary = thorClient.getSummary();
            if (summary == null || summary.getBestBlockNumber() == null) return;

            long bestBlock = summary.getBestBlockNumber();

            if (!initialized) {
                Long dbMax = transactionRepository.findMaxBlockNumber().orElse(null);
                lastIngestedBlock = dbMax != null
                        ? dbMax
                        : Math.max(0L, bestBlock - INITIAL_BACKFILL_BLOCKS);
                initialized = true;
                log.info("TransactionIngestionService initialized: lastIngestedBlock={}, bestBlock={}",
                        lastIngestedBlock, bestBlock);
            }

            long blocksRemaining = bestBlock - lastIngestedBlock;
            if (blocksRemaining <= 0) return;

            int batchSize = blocksRemaining > LIVE_THRESHOLD ? CATCHUP_BATCH : LIVE_BATCH;
            long toBlock = Math.min(bestBlock, lastIngestedBlock + batchSize);

            int saved = 0;
            for (long blockNum = lastIngestedBlock + 1; blockNum <= toBlock; blockNum++) {
                try {
                    saved += ingestBlock(blockNum);
                } catch (Exception e) {
                    log.warn("Skipping block {}: {}", blockNum, e.getMessage());
                }
                lastIngestedBlock = blockNum;
            }

            if (saved > 0 || blocksRemaining > LIVE_THRESHOLD) {
                log.debug("Ingested blocks {}-{}: {} transactions stored (remaining: {})",
                        toBlock - batchSize + 1, toBlock, saved, bestBlock - lastIngestedBlock);
            }

        } catch (Exception e) {
            log.error("TransactionIngestionService error: {}", e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private int ingestBlock(long blockNum) {
        Map<String, Object> block = thorClient.getBlockExpanded(String.valueOf(blockNum));
        if (block == null) return 0;

        Number rawTimestamp = (Number) block.get("timestamp");
        Number rawNumber = (Number) block.get("number");
        if (rawTimestamp == null || rawNumber == null) return 0;

        OffsetDateTime ts = OffsetDateTime.ofInstant(
                Instant.ofEpochSecond(rawTimestamp.longValue()), ZoneOffset.UTC);
        long blockNumber = rawNumber.longValue();

        // Ensure block row exists before inserting transactions (FK constraint)
        if (blockRepository.findByBlockNumber(blockNumber).isEmpty()) {
            Block blockEntity = new Block();
            blockEntity.setBlockNumber(blockNumber);
            blockEntity.setBlockHash((String) block.get("id"));
            Number rawSize = (Number) block.get("size");
            if (rawSize != null) blockEntity.setSize(rawSize.floatValue());
            blockEntity.setTimestamp(ts);
            blockRepository.save(blockEntity);
        }

        List<Map<String, Object>> transactions =
                (List<Map<String, Object>>) block.get("transactions");
        if (transactions == null || transactions.isEmpty()) return 0;

        int saved = 0;
        for (Map<String, Object> tx : transactions) {
            String txId = (String) tx.get("id");
            if (txId == null) continue;

            // Avoid duplicates on restart/catch-up.
            if (transactionRepository.findByTxHash(txId).isPresent()) continue;

            String origin = (String) tx.get("origin");
            Boolean reverted = (Boolean) tx.get("reverted");

            List<Map<String, Object>> clauses =
                    (List<Map<String, Object>>) tx.get("clauses");
            if (clauses == null || clauses.isEmpty()) continue;

            // Sum VET across all clauses; capture first non-null recipient
            double totalVet = 0.0;
            String primaryTo = null;
            for (Map<String, Object> clause : clauses) {
                if (primaryTo == null) {
                    primaryTo = (String) clause.get("to");
                }
                String hexValue = (String) clause.get("value");
                totalVet += hexWeiToNative(hexValue);
            }

            // Ensure address rows exist before inserting transactions (FK constraint).
            upsertAddress(origin, ts);
            upsertAddress(primaryTo, ts);

            // Gas fee in VTHO
            double gasFee = hexWeiToNative((String) tx.get("paid"));

            ensureAddress(origin, ts);
            ensureAddress(primaryTo, ts);

            Transaction transaction = new Transaction();
            transaction.setTxHash(txId);
            transaction.setFromAddress(origin);
            transaction.setToAddress(primaryTo);
            transaction.setValue((float) totalVet);
            transaction.setGasFee((float) gasFee);
            transaction.setBlockNumber(blockNumber);
            transaction.setTimestamp(ts);
            transaction.setStatus(Boolean.TRUE.equals(reverted) ? "reverted" : "success");

            transactionRepository.save(transaction);
            saved++;
        }
        return saved;
    }

    private void upsertAddress(String addressStr, OffsetDateTime ts) {
        if (addressStr == null || addressStr.isBlank()) return;
        if (addressRepository.findByAddressIgnoreCase(addressStr).isPresent()) return;

        Address a = new Address();
        a.setAddress(addressStr);
        a.setType("unknown");
        a.setBalance(0.0f);
        a.setRiskScore(0.0f);
        a.setFirstSeen(ts);
        a.setLastActive(ts);
        addressRepository.save(a);
    }

    private void ensureAddress(String addr, OffsetDateTime ts) {
        if (addr == null) return;
        if (addressRepository.findByAddress(addr).isEmpty()) {
            Address a = new Address();
            a.setAddress(addr);
            a.setFirstSeen(ts);
            a.setLastActive(ts);
            a.setType("unknown");
            a.setBalance(0.0f);
            a.setRiskScore(0.0f);
            addressRepository.save(a);
        }
    }

    /**
     * Converts a 0x-prefixed hex wei string to its native token amount (VET or VTHO).
     * Returns 0.0 for null/empty/"0x0" inputs.
     */
    private static double hexWeiToNative(String hex) {
        if (hex == null || hex.equals("0x") || hex.equals("0x0") || hex.isEmpty()) return 0.0;
        try {
            String digits = hex.startsWith("0x") ? hex.substring(2) : hex;
            if (digits.isEmpty()) return 0.0;
            return new BigInteger(digits, 16).doubleValue() / 1e18;
        } catch (Exception e) {
            return 0.0;
        }
    }
}
