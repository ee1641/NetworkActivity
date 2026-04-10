package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.FlowAddressSummaryDto;
import edu.rit.NetworkActivity.service.dto.FlowAggregateDto;
import edu.rit.NetworkActivity.service.dto.HotspotDto;
import edu.rit.NetworkActivity.service.dto.HotspotPageDto;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    public FlowAggregateDto getAggregate(OffsetDateTime start, OffsetDateTime end, String address, Float minVol,
            Float maxVol) {
        List<Transaction> txs;

        float effectiveMin = minVol != null ? minVol : 0.0f;
        float effectiveMax = maxVol != null ? maxVol : Float.MAX_VALUE;

        if (address != null && !address.isBlank()) {
            txs = transactionRepository.findByFromAddressAndTimestampBetween(address, start, end).stream()
                    .filter(tx -> tx.getValue() != null && tx.getValue() >= effectiveMin
                            && tx.getValue() <= effectiveMax)
                    .collect(Collectors.toList());
            List<Transaction> incoming = transactionRepository.findByToAddressAndTimestampBetween(address, start, end)
                    .stream()
                    .filter(tx -> tx.getValue() != null && tx.getValue() >= effectiveMin
                            && tx.getValue() <= effectiveMax)
                    .collect(Collectors.toList());

            Set<Long> ids = txs.stream().map(Transaction::getId).collect(Collectors.toSet());
            for (Transaction tx : incoming) {
                if (!ids.contains(tx.getId())) {
                    txs.add(tx);
                    ids.add(tx.getId());
                }
            }
        } else {
            txs = transactionRepository.findByValueGreaterThanEqualAndTimestampBetween(effectiveMin, start, end)
                    .stream()
                    .filter(tx -> tx.getValue() <= effectiveMax)
                    .collect(Collectors.toList());
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

        // Calculate real flows (from -> to)
        List<Object[]> flowRows = transactionRepository.groupByFlowBetween(start, end, effectiveMin, effectiveMax);
        List<Map<String, Object>> flows = flowRows.stream()
                .map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("from", row[0]);
                    m.put("to", row[1]);
                    m.put("value", row[2]);
                    m.put("count", row[3]);
                    return m;
                })
                .sorted((a, b) -> Double.compare(((Number) b.get("value")).doubleValue(),
                        ((Number) a.get("value")).doubleValue()))
                .limit(50) // Return top 50 flows for better performance
                .collect(Collectors.toList());

        FlowAggregateDto dto = new FlowAggregateDto();
        dto.setTransactionCount(txs.size());
        dto.setTotalTransferredValue(totalValue);
        dto.setTotalGasFees(totalGas);
        dto.setUniqueSenders(uniqueSenders);
        dto.setUniqueReceivers(uniqueReceivers);
        dto.setTopSenders(topMap(senderGroups));
        dto.setTopReceivers(topMap(receiverGroups));
        dto.setFlows(flows);

        return dto;
    }

    public HotspotPageDto getTopHotspots(
            OffsetDateTime start,
            OffsetDateTime end,
            OffsetDateTime priorStart,
            String category,
            String sortBy,
            int page,
            int pageSize) {

        // Aggregate query: one row per receiver (DB does the GROUP BY — much faster)
        List<Object[]> aggregated = transactionRepository.groupByReceiverBetween(start, end);

        // Prior period counts for trend (also aggregated in DB)
        List<Object[]> priorRows = transactionRepository.countByReceiverBetween(priorStart, start);
        Map<String, Long> priorCountMap = new HashMap<>();
        for (Object[] row : priorRows) {
            priorCountMap.put((String) row[0], ((Number) row[1]).longValue());
        }

        // Batch label lookup — one query for all addresses instead of N queries
        List<String> addresses = aggregated.stream()
                .map(row -> (String) row[0])
                .collect(Collectors.toList());
        Map<String, Label> labelMap = new HashMap<>();
        if (!addresses.isEmpty()) {
            labelRepository.findByAddressIn(addresses)
                    .forEach(l -> labelMap.put(l.getAddress(), l));
        }

        // Build HotspotDto list from aggregated rows
        List<HotspotDto> hotspots = new ArrayList<>();
        for (Object[] row : aggregated) {
            String address = (String) row[0];
            long txCount = ((Number) row[1]).longValue();
            double vol = row[2] == null ? 0.0 : ((Number) row[2]).doubleValue();
            double avg = txCount == 0 ? 0.0 : vol / txCount;

            long priorCount = priorCountMap.getOrDefault(address, 0L);
            double trend = priorCount == 0
                    ? (txCount > 0 ? 100.0 : 0.0)
                    : ((txCount - priorCount) / (double) priorCount) * 100.0;

            Label label = labelMap.get(address);

            HotspotDto dto = new HotspotDto();
            dto.setAddress(address);
            dto.setLabelName(label != null ? label.getLabelName() : "Unlabeled");
            dto.setCategory(label != null && label.getCategory() != null ? label.getCategory() : "Unknown");
            dto.setTransactionCount(txCount);
            dto.setTotalVolume(vol);
            dto.setAvgTransactionValue(avg);
            dto.setTrendPercent(trend);

            hotspots.add(dto);
        }

        // Category filter
        boolean filterCategory = category != null
                && !category.isBlank()
                && !category.equalsIgnoreCase("All Categories");

        Stream<HotspotDto> stream = hotspots.stream();
        if (filterCategory) {
            stream = stream.filter(h -> category.equalsIgnoreCase(h.getCategory()));
        }

        // Sort
        Comparator<HotspotDto> comparator;
        if ("volume".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(HotspotDto::getTotalVolume).reversed();
        } else if ("trend".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(HotspotDto::getTrendPercent).reversed();
        } else {
            comparator = Comparator.comparing(HotspotDto::getTransactionCount).reversed();
        }

        List<HotspotDto> sorted = stream.sorted(comparator).collect(Collectors.toList());

        // Summary totals (before pagination slice)
        long totalTransactions = sorted.stream().mapToLong(HotspotDto::getTransactionCount).sum();
        double summaryVolume = sorted.stream().mapToDouble(HotspotDto::getTotalVolume).sum();
        long totalCount = sorted.size();
        int safePage = Math.max(0, page);
        int safePageSize = Math.max(1, Math.min(pageSize, 100));
        int totalPages = totalCount == 0 ? 1 : (int) Math.ceil((double) totalCount / safePageSize);

        // Pagination slice
        int fromIndex = safePage * safePageSize;
        List<HotspotDto> pageContent = fromIndex >= sorted.size()
                ? new ArrayList<>()
                : sorted.subList(fromIndex, Math.min(fromIndex + safePageSize, sorted.size()));

        HotspotPageDto result = new HotspotPageDto();
        result.setContent(pageContent);
        result.setPage(safePage);
        result.setPageSize(safePageSize);
        result.setTotalCount(totalCount);
        result.setTotalPages(totalPages);
        result.setTotalTransactions(totalTransactions);
        result.setTotalVolume(summaryVolume);

        return result;
    }

    public List<Transaction> getLargeTransactions(Float minValue, OffsetDateTime start, OffsetDateTime end, int limit) {
        return transactionRepository.findByValueGreaterThanEqualAndTimestampBetween(minValue, start, end).stream()
                .sorted(Comparator.comparing(Transaction::getValue).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Returns transaction volume aggregated by hour for the dashboard chart.
     */
    public List<Map<String, Object>> getVolumeTimeSeries(OffsetDateTime start, OffsetDateTime end) {
        List<Object[]> rows = transactionRepository.getVolumeByHour(start, end);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("ts", row[0].toString());
            map.put("count", row[1]);
            result.add(map);
        }
        return result;
    }

    /**
     * PROXY LOGIC FOR GROUP COLLABORATION:
     * This method categories active addresses (hotspots) as "clusters" for the dashboard metrics.
     * TODO: Future teammates should replace this placeholder logic with real clustering 
     * algorithms (e.g., K-Means or Heuristic-based wallet grouping).
     */
    public Map<String, Object> getClusterStatistics(OffsetDateTime start, OffsetDateTime end) {
        List<Object[]> aggregated = transactionRepository.groupByReceiverBetween(start, end);
        
        long high = 0;
        long medium = 0;
        long low = 0;
        
        for (Object[] row : aggregated) {
            long txCount = ((Number) row[1]).longValue();
            if (txCount > 20) high++;      // High activity threshold
            else if (txCount > 5) medium++; // Medium activity threshold
            else low++;                     // Low activity
        }
        
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalClusters", aggregated.size());
        stats.put("highActivity", high);
        stats.put("mediumActivity", medium);
        stats.put("lowActivity", low);
        return stats;
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