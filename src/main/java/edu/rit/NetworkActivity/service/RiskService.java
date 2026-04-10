package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.AlertRule;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.AlertRuleRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.service.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RiskService {

    private static final String TYPE_ANOMALY = "ANOMALY_THRESHOLD";
    private static final String TYPE_LARGE_TX = "LARGE_TRANSFER";
    private static final String TYPE_SPIKE = "ACTIVITY_SPIKE";

    private final TransactionRepository transactionRepository;
    private final AlertRuleRepository alertRuleRepository;

    public RiskService(TransactionRepository transactionRepository,
                       AlertRuleRepository alertRuleRepository) {
        this.transactionRepository = transactionRepository;
        this.alertRuleRepository = alertRuleRepository;
    }

    // ── Alert config persistence ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AlertConfigDto getAlertConfig() {
        List<AlertRule> rules = alertRuleRepository.findAll();
        AlertConfigDto dto = new AlertConfigDto();
        for (AlertRule r : rules) {
            if (r.getThresholdValue() == null) continue;
            switch (r.getType()) {
                case TYPE_ANOMALY  -> dto.setAnomalyThreshold(r.getThresholdValue());
                case TYPE_LARGE_TX -> dto.setLargeTxThreshold(r.getThresholdValue());
                case TYPE_SPIKE    -> dto.setActivitySpikePercent(r.getThresholdValue());
            }
        }
        return dto;
    }

    public void saveAlertConfig(AlertConfigDto cfg) {
        List<AlertRule> existing = alertRuleRepository.findAll().stream()
                .filter(r -> List.of(TYPE_ANOMALY, TYPE_LARGE_TX, TYPE_SPIKE).contains(r.getType()))
                .collect(Collectors.toList());
        alertRuleRepository.deleteAll(existing);

        List<AlertRule> newRules = new ArrayList<>();
        newRules.add(buildRule(TYPE_ANOMALY,  cfg.getAnomalyThreshold()));
        newRules.add(buildRule(TYPE_LARGE_TX, cfg.getLargeTxThreshold()));
        newRules.add(buildRule(TYPE_SPIKE,    cfg.getActivitySpikePercent()));
        alertRuleRepository.saveAll(newRules);
    }

    private AlertRule buildRule(String type, float value) {
        AlertRule r = new AlertRule();
        r.setType(type);
        r.setThresholdValue(value);
        r.setNotificationMethod("DASHBOARD");
        return r;
    }

    // ── Summary ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public RiskSummaryDto getRiskSummary(OffsetDateTime start, OffsetDateTime end,
                                         float anomalyThreshold,
                                         float largeTxThreshold,
                                         float activitySpikePercent) {
        RiskSummaryDto dto = new RiskSummaryDto();
        dto.setLargeTransfers(countLargeTransfers(start, end, largeTxThreshold));
        dto.setAbnormalPatterns(countAbnormalPatterns(start, end));
        dto.setActivitySpikes(countActivitySpikes(start, end, activitySpikePercent));
        return dto;
    }

    private long countLargeTransfers(OffsetDateTime start, OffsetDateTime end, float threshold) {
        return transactionRepository
                .findByValueGreaterThanEqualAndTimestampBetween(threshold, start, end)
                .size();
    }

    private long countAbnormalPatterns(OffsetDateTime start, OffsetDateTime end) {
        List<Object[]> rows = transactionRepository.groupByReceiverBetween(start, end);
        if (rows.isEmpty()) return 0;
        double[] counts = rows.stream()
                .mapToDouble(r -> ((Number) r[1]).doubleValue())
                .toArray();
        double mean = Arrays.stream(counts).average().orElse(0);
        double stddev = stddev(counts, mean);
        return Arrays.stream(counts).filter(c -> c > mean + 2 * stddev).count();
    }

    private long countActivitySpikes(OffsetDateTime start, OffsetDateTime end, float spikePercent) {
        OffsetDateTime mid = start.plusSeconds(java.time.Duration.between(start, end).getSeconds() / 2);
        Map<String, Long> first  = toCountMap(transactionRepository.countByReceiverBetween(start, mid));
        Map<String, Long> second = toCountMap(transactionRepository.countByReceiverBetween(mid, end));
        long spikes = 0;
        for (Map.Entry<String, Long> e : second.entrySet()) {
            long prev = first.getOrDefault(e.getKey(), 0L);
            double changePercent = (e.getValue() - prev) / (double) Math.max(prev, 1) * 100.0;
            if (changePercent > spikePercent) spikes++;
        }
        return spikes;
    }

    // ── Anomaly time-series ───────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AnomalyPointDto> getAnomalyTimeSeries(OffsetDateTime start, OffsetDateTime end) {
        List<Transaction> txs = transactionRepository.findByTimestampBetween(start, end);

        // Bucket by hour
        TreeMap<Long, List<Transaction>> buckets = new TreeMap<>();
        for (Transaction tx : txs) {
            long hourKey = tx.getTimestamp().toEpochSecond() / 3600;
            buckets.computeIfAbsent(hourKey, k -> new ArrayList<>()).add(tx);
        }

        if (buckets.isEmpty()) return List.of();

        double[] counts = buckets.values().stream()
                .mapToDouble(List::size)
                .toArray();
        double mean   = Arrays.stream(counts).average().orElse(0);
        double stddev = stddev(counts, mean);

        List<AnomalyPointDto> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
        for (Map.Entry<Long, List<Transaction>> entry : buckets.entrySet()) {
            List<Transaction> bucket = entry.getValue();
            double count  = bucket.size();
            double zScore = stddev == 0 ? 0 : (count - mean) / stddev;
            double score  = Math.min(100, Math.max(0, 50 + zScore * 10));

            String label = bucket.get(0).getTimestamp()
                    .toLocalDateTime().withMinute(0).withSecond(0)
                    .format(fmt);

            // Top 3 most-active receivers in this hour bucket
            List<String> topAddresses = bucket.stream()
                    .filter(t -> t.getToAddress() != null)
                    .collect(Collectors.groupingBy(Transaction::getToAddress, Collectors.counting()))
                    .entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            result.add(new AnomalyPointDto(label, Math.round(score * 10.0) / 10.0, topAddresses));
        }
        return result;
    }

    // ── Incidents ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<RiskIncidentDto> getRiskIncidents(OffsetDateTime start, OffsetDateTime end,
                                                   float largeTxThreshold, int limit) {
        // One fetch for large-tx data; reuse it to build a rep-tx lookup map for AP/AS incidents
        List<Transaction> largeTxs = transactionRepository
                .findByValueGreaterThanEqualAndTimestampBetween(largeTxThreshold, start, end);

        // Build address → best tx map (highest value tx seen for each address) — no extra queries
        Map<String, Transaction> bestTxByAddress = new HashMap<>();
        for (Transaction tx : largeTxs) {
            String addr = tx.getToAddress() != null ? tx.getToAddress() : tx.getFromAddress();
            if (addr == null) continue;
            bestTxByAddress.merge(addr, tx, (a, b) -> {
                float av = a.getValue() == null ? 0f : a.getValue();
                float bv = b.getValue() == null ? 0f : b.getValue();
                return bv > av ? b : a;
            });
        }

        int perType = Math.max(1, limit / 3);
        List<RiskIncidentDto> incidents = new ArrayList<>();
        incidents.addAll(buildLargeTxIncidents(largeTxs, largeTxThreshold, perType));
        incidents.addAll(buildAbnormalPatternIncidents(start, end, perType, bestTxByAddress));
        incidents.addAll(buildActivitySpikeIncidents(start, end, 50f, limit - 2 * perType, bestTxByAddress));

        // Sort: HIGH first, then MEDIUM, then LOW; within each severity by timestamp desc
        incidents.sort(Comparator
                .comparingInt((RiskIncidentDto d) -> severityWeight(d.getSeverity()))
                .reversed()
                .thenComparing(Comparator.comparing(RiskIncidentDto::getTimestamp).reversed()));
        return incidents;
    }

    private int severityWeight(String s) {
        return switch (s == null ? "" : s) {
            case "HIGH"   -> 3;
            case "MEDIUM" -> 2;
            default       -> 1;
        };
    }

    private List<RiskIncidentDto> buildLargeTxIncidents(List<Transaction> txs,
                                                         float threshold, int cap) {
        return txs.stream()
                .sorted(Comparator.comparing(Transaction::getValue,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(cap)
                .map(tx -> {
                    double val = tx.getValue() == null ? 0 : tx.getValue().doubleValue();
                    String severity = val > threshold * 3 ? "HIGH" : val > threshold * 1.5 ? "MEDIUM" : "LOW";
                    RiskIncidentDto dto = new RiskIncidentDto();
                    dto.setIncidentId(String.valueOf(tx.getId()));
                    dto.setType("Large Transfer");
                    dto.setSeverity(severity);
                    dto.setAmount(val);
                    dto.setAddress(tx.getToAddress() != null ? tx.getToAddress() : tx.getFromAddress());
                    dto.setTxHash(tx.getTxHash());
                    dto.setTimestamp(tx.getTimestamp() != null ? tx.getTimestamp().toString() : "");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private List<RiskIncidentDto> buildAbnormalPatternIncidents(OffsetDateTime start, OffsetDateTime end,
                                                                  int cap,
                                                                  Map<String, Transaction> bestTxByAddress) {
        List<Object[]> rows = transactionRepository.groupByReceiverBetween(start, end);
        if (rows.isEmpty()) return List.of();

        double[] counts = rows.stream().mapToDouble(r -> ((Number) r[1]).doubleValue()).toArray();
        double mean   = Arrays.stream(counts).average().orElse(0);
        double stddev = stddev(counts, mean);

        // Collect outlier addresses first (no DB calls yet)
        List<Object[]> outliers = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            if (counts[i] > mean + 2 * stddev) outliers.add(rows.get(i));
        }
        if (outliers.isEmpty()) return List.of();

        // One batch query for all outlier addresses not already in bestTxByAddress
        List<String> missing = outliers.stream()
                .map(r -> (String) r[0])
                .filter(a -> !bestTxByAddress.containsKey(a))
                .collect(Collectors.toList());
        if (!missing.isEmpty()) {
            transactionRepository.findByToAddressInAndTimestampBetween(missing, start, end)
                    .forEach(tx -> bestTxByAddress.merge(tx.getToAddress(), tx, (a, b) -> {
                        float av = a.getValue() == null ? 0f : a.getValue();
                        float bv = b.getValue() == null ? 0f : b.getValue();
                        return bv > av ? b : a;
                    }));
        }

        List<RiskIncidentDto> list = new ArrayList<>();
        for (Object[] row : outliers) {
            String      address  = (String) row[0];
            double      count    = ((Number) row[1]).doubleValue();
            double      volume   = row[2] == null ? 0 : ((Number) row[2]).doubleValue();
            String      severity = count > mean + 3 * stddev ? "HIGH" : "MEDIUM";
            Transaction rep      = bestTxByAddress.get(address);

            RiskIncidentDto dto = new RiskIncidentDto();
            dto.setIncidentId("AP-" + Math.abs(address.hashCode() % 9000 + 1000));
            dto.setType("Abnormal Pattern");
            dto.setSeverity(severity);
            dto.setAmount(volume);
            dto.setAddress(address);
            dto.setTxHash(rep != null ? rep.getTxHash() : "");
            dto.setTimestamp(rep != null && rep.getTimestamp() != null
                    ? rep.getTimestamp().toString() : end.toString());
            list.add(dto);
        }

        list.sort(Comparator.comparingInt((RiskIncidentDto d) -> severityWeight(d.getSeverity())).reversed());
        return list.stream().limit(cap).collect(Collectors.toList());
    }

    private List<RiskIncidentDto> buildActivitySpikeIncidents(OffsetDateTime start, OffsetDateTime end,
                                                               float spikePercent, int cap,
                                                               Map<String, Transaction> bestTxByAddress) {
        OffsetDateTime mid = start.plusSeconds(java.time.Duration.between(start, end).getSeconds() / 2);
        Map<String, Long> first  = toCountMap(transactionRepository.countByReceiverBetween(start, mid));
        Map<String, Long> second = toCountMap(transactionRepository.countByReceiverBetween(mid, end));

        record SpikeEntry(String address, double changePct) {}
        List<SpikeEntry> spikes = new ArrayList<>();
        for (Map.Entry<String, Long> e : second.entrySet()) {
            long   prev   = first.getOrDefault(e.getKey(), 0L);
            double change = (e.getValue() - prev) / (double) Math.max(prev, 1) * 100.0;
            if (change > spikePercent) spikes.add(new SpikeEntry(e.getKey(), change));
        }
        spikes.sort(Comparator.comparingDouble(SpikeEntry::changePct).reversed());
        List<SpikeEntry> capped = spikes.stream().limit(cap).toList();

        // One batch query for spike addresses not already in bestTxByAddress
        List<String> missing = capped.stream()
                .map(SpikeEntry::address)
                .filter(a -> !bestTxByAddress.containsKey(a))
                .collect(Collectors.toList());
        if (!missing.isEmpty()) {
            transactionRepository.findByToAddressInAndTimestampBetween(missing, mid, end)
                    .forEach(tx -> bestTxByAddress.merge(tx.getToAddress(), tx, (a, b) -> {
                        float av = a.getValue() == null ? 0f : a.getValue();
                        float bv = b.getValue() == null ? 0f : b.getValue();
                        return bv > av ? b : a;
                    }));
        }

        List<RiskIncidentDto> list = new ArrayList<>();
        for (SpikeEntry spike : capped) {
            String      address  = spike.address();
            double      change   = spike.changePct();
            String      severity = change > spikePercent * 3 ? "HIGH" : change > spikePercent * 1.5 ? "MEDIUM" : "LOW";
            Transaction rep      = bestTxByAddress.get(address);

            RiskIncidentDto dto = new RiskIncidentDto();
            dto.setIncidentId("SP-" + Math.abs(address.hashCode() % 9000 + 1000));
            dto.setType("Activity Spike");
            dto.setSeverity(severity);
            dto.setAmount(rep != null && rep.getValue() != null ? rep.getValue().doubleValue() : 0);
            dto.setAddress(address);
            dto.setTxHash(rep != null ? rep.getTxHash() : "");
            dto.setTimestamp(rep != null && rep.getTimestamp() != null
                    ? rep.getTimestamp().toString() : end.toString());
            list.add(dto);
        }
        return list;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private double stddev(double[] values, double mean) {
        if (values.length < 2) return 0;
        double variance = Arrays.stream(values)
                .map(v -> Math.pow(v - mean, 2))
                .average()
                .orElse(0);
        return Math.sqrt(variance);
    }

    private Map<String, Long> toCountMap(List<Object[]> rows) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            map.put((String) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }
}
