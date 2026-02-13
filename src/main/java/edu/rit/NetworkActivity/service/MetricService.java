package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MetricService {

    private static final Logger log = LoggerFactory.getLogger(MetricService.class);
    private final MetricSampleRepository repo;

    public MetricService(MetricSampleRepository repo) {
        this.repo = repo;
    }

    public OffsetDateTime sinceFromRange(String range) {
        OffsetDateTime now = OffsetDateTime.now();
        if (range == null || range.equals("all")) {
            LogStrategy.info(log, "metric.range.resolved", "inputRange", range, "resolvedRange", "all");
            return OffsetDateTime.MIN;
        }

        OffsetDateTime since = switch (range) {
            case "24h" -> now.minusHours(24);
            case "7d" -> now.minusDays(7);
            case "30d" -> now.minusDays(30);
            default -> OffsetDateTime.MIN;
        };
        LogStrategy.info(log, "metric.range.resolved", "inputRange", range, "resolvedRange", since == OffsetDateTime.MIN ? "all" : range);
        return since;
    }

    public List<MetricSample> getTimeSeries(String metricName, String range) {
        OffsetDateTime since = sinceFromRange(range);
        List<MetricSample> metrics = repo.findByMetricNameAndTsAfterOrderByTsAsc(metricName, since);
        LogStrategy.info(log, "metric.timeseries.fetched", "metric", metricName, "range", range, "count", metrics.size());
        return metrics;
    }

    /**
     * Simple “dashboard cards” summary:
     * - tx_count: sum
     * - tx_volume: sum
     * - active_wallets: latest value
     * - success_rate: latest value
     */
    public Map<String, Object> getSummary(String range) {
        OffsetDateTime since = sinceFromRange(range);
        List<MetricSample> samples = repo.findByTsAfterOrderByTsAsc(since);

        Map<String, List<MetricSample>> byName =
                samples.stream().collect(Collectors.groupingBy(MetricSample::getMetricName));

        double txCount = sum(byName.get("tx_count"));
        double txVolume = sum(byName.get("tx_volume"));

        Double activeWallets = latest(byName.get("active_wallets"));
        Double successRate = latest(byName.get("success_rate"));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("range", range == null ? "all" : range);
        out.put("txCount", txCount);
        out.put("txVolume", txVolume);
        out.put("activeWallets", activeWallets);
        out.put("successRate", successRate);

        LogStrategy.info(log, "metric.summary.fetched", "range", out.get("range"), "sampleCount", samples.size());
        return out;
    }

    private double sum(List<MetricSample> list) {
        if (list == null) return 0;
        return list.stream().mapToDouble(MetricSample::getValue).sum();
    }

    private Double latest(List<MetricSample> list) {
        if (list == null || list.isEmpty()) return null;
        return list.get(list.size() - 1).getValue();
    }
}
