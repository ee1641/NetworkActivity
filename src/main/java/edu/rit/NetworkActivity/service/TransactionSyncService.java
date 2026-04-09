package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Block;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.BlockRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

@Service
public class TransactionSyncService {

    private static final Logger log = LoggerFactory.getLogger(TransactionSyncService.class);
    private final VeChainThorClient veChainClient;
    private final TransactionRepository transactionRepository;
    private final BlockRepository blockRepository;
    private final AddressRepository addressRepository;

    public TransactionSyncService(VeChainThorClient veChainClient,
            TransactionRepository transactionRepository,
            BlockRepository blockRepository,
            AddressRepository addressRepository) {
        this.veChainClient = veChainClient;
        this.transactionRepository = transactionRepository;
        this.blockRepository = blockRepository;
        this.addressRepository = addressRepository;
    }

    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void syncTransactions() {
        try {
            VeChainSummaryDto summary = veChainClient.getSummary();
            if (summary == null || summary.getBestBlockNumber() == null) {
                return;
            }

            long currentBest = summary.getBestBlockNumber();
            long lastProcessed = blockRepository.findMaxBlockNumber().orElse(currentBest - 20);

            log.info("Starting sync from block {} to {}", lastProcessed + 1, currentBest);

            for (long i = lastProcessed + 1; i <= currentBest; i++) {
                processBlock(i);
            }
        } catch (Exception e) {
            log.error("Error during transaction sync", e);
        }
    }

    @Transactional
    public void processBlock(long blockNumber) {
        Map<String, Object> blockData = veChainClient.getBlockExpanded(String.valueOf(blockNumber));
        if (blockData == null)
            return;

        Object tsObj = blockData.get("timestamp");
        OffsetDateTime timestamp = OffsetDateTime.now(ZoneOffset.UTC);
        if (tsObj instanceof Number) {
            timestamp = OffsetDateTime.ofInstant(
                    Instant.ofEpochSecond(((Number) tsObj).longValue()),
                    ZoneOffset.UTC);
        }

        if (blockRepository.findByBlockNumber(blockNumber).isPresent()) {
            log.debug("Block {} already exists, skipping", blockNumber);
            return;
        }

        Block block = new Block();
        block.setBlockNumber(blockNumber);
        block.setBlockHash((String) blockData.get("id"));
        block.setTimestamp(timestamp);
        blockRepository.save(block);

        @SuppressWarnings("unchecked")
        List<Object> txs = (List<Object>) blockData.get("transactions");
        if (txs != null) {
            for (Object txObj : txs) {
                if (txObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> txMap = (Map<String, Object>) txObj;
                    saveTransaction(txMap, blockNumber, timestamp);
                } else if (txObj instanceof String) {
                    Map<String, Object> txData = veChainClient.getTransaction((String) txObj);
                    if (txData != null) {
                        saveTransaction(txData, blockNumber, timestamp);
                    }
                }
            }
        }

        log.info("Processed block {} with {} transactions", blockNumber, txs != null ? txs.size() : 0);
    }

    private void saveTransaction(Map<String, Object> txData, long blockNumber, OffsetDateTime timestamp) {
        String from = (String) txData.get("origin");
        getOrCreateAddress(from, timestamp);

        Transaction tx = new Transaction();
        tx.setTxHash((String) txData.get("id"));
        tx.setBlockNumber(blockNumber);
        tx.setTimestamp(timestamp);
        tx.setFromAddress(from);

        // Clauses in VeChain contain the actual transfers
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> clauses = (List<Map<String, Object>>) txData.get("clauses");
        if (clauses != null && !clauses.isEmpty()) {
            // For simplicity in this visualization, we take the first clause as the primary
            // transfer
            Map<String, Object> firstClause = clauses.get(0);
            String to = (String) firstClause.get("to");
            if (to != null) {
                getOrCreateAddress(to, timestamp);
            }
            tx.setToAddress(to);

            Object valueObj = firstClause.get("value");
            if (valueObj != null) {
                // VeChain values are often large hex strings (wei), we convert to a readable
                // float for vis
                try {
                    String hexValue = valueObj.toString();
                    if (hexValue.startsWith("0x")) {
                        // VeChain uses 18 decimals for VET/VTHO
                        java.math.BigInteger wei = new java.math.BigInteger(hexValue.substring(2), 16);
                        // Convert to VET (divide by 10^18)
                        tx.setValue(wei.divide(java.math.BigInteger.TEN.pow(14)).floatValue() / 10000.0f);
                    } else {
                        tx.setValue(Float.parseFloat(hexValue));
                    }
                } catch (Exception e) {
                    tx.setValue(0.0f);
                }
            }
        }

        tx.setGasFee(0.01f); // Placeholder gas fee
        tx.setStatus("success");
        transactionRepository.save(tx);
    }

    private void getOrCreateAddress(String addressStr, OffsetDateTime timestamp) {
        if (addressStr == null)
            return;

        if (addressRepository.findByAddress(addressStr).isEmpty()) {
            Address address = new Address();
            address.setAddress(addressStr);
            address.setFirstSeen(timestamp);
            address.setLastActive(timestamp);
            address.setType("unknown");
            address.setBalance(0.0f);
            address.setRiskScore(0.0f);
            addressRepository.save(address);
        }
    }
}
