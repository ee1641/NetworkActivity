package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.FlowAddressSummaryDto;
import edu.rit.NetworkActivity.service.dto.FlowAggregateDto;
import edu.rit.NetworkActivity.service.dto.HotspotDto;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlowService {

    private final TransactionRepository transactionRepository;
    private final LabelRepository labelRepository;

    public FlowService(TransactionRepository transactionRepository, LabelRepository labelRepository) {
        this.transactionRepository = transactionRepository;
        this.labelRepository = labelRepository;
    }

    public List<Transaction> getTransactionsForAddress(String address, OffsetDateTime start, OffsetDateTime end) {
        List<Transaction> outgoing = transactionRepository.findByFromAddressAndTimestampBetween(address, start, end);
        List<Transaction> incoming = transactionRepository.findByToAddressAndTimestampBetween(address, start, end);

        Map<Long, Transaction> merged = new LinkedHashMap<>();
        for (Transaction tx : outgoing)
            merged.put(tx.getId(), tx);
        for (Transaction tx : incoming)
            merged.put(tx.getId(), tx);

        return merged.values().stream()
                .sorted(Comparator.comparing(Transaction::getTimestamp).reversed())
                .collect(Collectors.toList());
    }

    public FlowAddressSummaryDto getAddressSummary(String address, OffsetDateTime start, OffsetDateTime end) {
        List<Transaction> incoming = transactionRepository.findByToAddressAndTimestampBetween(address, start, end);
        List<Transaction> outgoing = transactionRepository.findByFromAddressAndTimestampBetween(address, start, end);

        double inflow = incoming.stream()
                .map(Transaction::getValue)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();

        double outflow = outgoing.stream()
                .map(Transaction::getValue)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();

        double gas = outgoing.stream()
                .map(Transaction::getGasFee)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();

        FlowAddressSummaryDto dto = new FlowAddressSummaryDto();
        dto.setAddress(address);
        dto.setTotalInflow(inflow);
        dto.setTotalOutflow(outflow);
        dto.setIncomingTxCount(incoming.size());
        dto.setOutgoingTxCount(outgoing.size());
        dto.setTotalGasFees(gas);

        return dto;
    }

    public FlowAggregateDto getAggregate(OffsetDateTime start, OffsetDateTime end, String address) {
        List<Transaction> txs;

        if (address != null && !address.isBlank()) {
            txs = getTransactionsForAddress(address, start, end);
        } else {
            txs = transactionRepository.findByTimestampBetween(start, end);
        }

        double totalValue = txs.stream()
                .map(Transaction::getValue)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();

        double totalGas = txs.stream()
                .map(Transaction::getGasFee)
                .filter(Objects::nonNull)
                .mapToDouble(Float::doubleValue)
                .sum();

        long uniqueSenders = txs.stream()
                .map(Transaction::getFromAddress)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        long uniqueReceivers = txs.stream()
                .map(Transaction::getToAddress)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        Map<String, List<Transaction>> senderGroups = txs.stream()
                .filter(tx -> tx.getFromAddress() != null)
                .collect(Collectors.groupingBy(Transaction::getFromAddress));

        Map<String, List<Transaction>> receiverGroups = txs.stream()
                .filter(tx -> tx.getToAddress() != null)
                .collect(Collectors.groupingBy(Transaction::getToAddress));

        FlowAggregateDto dto = new FlowAggregateDto();
        dto.setTransactionCount(txs.size());
        dto.setTotalTransferredValue(totalValue);
        dto.setTotalGasFees(totalGas);
        dto.setUniqueSenders(uniqueSenders);
        dto.setUniqueReceivers(uniqueReceivers);
        dto.setTopSenders(topMap(senderGroups));
        dto.setTopReceivers(topMap(receiverGroups));

        return dto;
    }

    public List<HotspotDto> getTopHotspots(OffsetDateTime start, OffsetDateTime end, int limit) {
        List<Transaction> txs = transactionRepository.findByTimestampBetween(start, end);

        Map<String, List<Transaction>> grouped = txs.stream()
                .filter(tx -> tx.getToAddress() != null)
                .collect(Collectors.groupingBy(Transaction::getToAddress));

        List<HotspotDto> hotspots = new ArrayList<>();

        for (Map.Entry<String, List<Transaction>> entry : grouped.entrySet()) {
            String address = entry.getKey();
            List<Transaction> addressTxs = entry.getValue();

            double totalVolume = addressTxs.stream()
                    .map(Transaction::getValue)
                    .filter(Objects::nonNull)
                    .mapToDouble(Float::doubleValue)
                    .sum();

            long txCount = addressTxs.size();
            double avg = txCount == 0 ? 0 : totalVolume / txCount;

            Label label = labelRepository.findByAddress(address).orElse(null);

            HotspotDto dto = new HotspotDto();
            dto.setAddress(address);
            dto.setLabelName(label != null ? label.getLabelName() : "Unlabeled");
            dto.setCategory(label != null ? label.getCategory() : "Unknown");
            dto.setTransactionCount(txCount);
            dto.setTotalVolume(totalVolume);
            dto.setAvgTransactionValue(avg);

            hotspots.add(dto);
        }

        return hotspots.stream()
                .sorted(Comparator.comparing(HotspotDto::getTransactionCount).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<Transaction> getLargeTransactions(Float minValue, OffsetDateTime start, OffsetDateTime end, int limit) {
        return transactionRepository.findByValueGreaterThanEqualAndTimestampBetween(minValue, start, end).stream()
                .sorted(Comparator.comparing(Transaction::getValue).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> topMap(Map<String, List<Transaction>> groupedEntries) {
        return groupedEntries.entrySet().stream()
                .map(e -> {
                    double totalValue = e.getValue().stream()
                            .mapToDouble(tx -> tx.getValue() != null ? tx.getValue().doubleValue() : 0.0)
                            .sum();

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("address", e.getKey());
                    row.put("value", totalValue);
                    row.put("transactionCount", e.getValue().size());
                    return row;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("value"), (Double) a.get("value")))
                .limit(10)
                .collect(Collectors.toList());
    }
}