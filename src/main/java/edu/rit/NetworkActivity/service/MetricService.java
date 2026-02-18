package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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

        OffsetDateTime allSince = OffsetDateTime.of(1970, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);

        if (range == null || range.equals("all")) {
            LogStrategy.info(log, LogEvents.METRIC_RANGE_RESOLVED, "inputRange", range, "resolvedRange", "all");
            return allSince;
        }

        OffsetDateTime since = switch (range) {
            case "24h" -> now.minusHours(24);
            case "7d" -> now.minusDays(7);
            case "30d" -> now.minusDays(30);
            default -> allSince;
        };

        LogStrategy.info(log, LogEvents.METRIC_RANGE_RESOLVED, "inputRange", range, "resolvedRange",
                since.equals(allSince) ? "all" : range);

        return since;
    }

    public List<MetricSample> getTimeSeries(String metricName, String range) {
        OffsetDateTime since = sinceFromRange(range);
        List<MetricSample> metrics = repo.findByMetricNameAndTsAfterOrderByTsAsc(metricName, since);
        LogStrategy.info(log, LogEvents.METRIC_TIMESERIES_FETCHED, "metric", metricName, "range", range, "count",
                metrics.size());
        return metrics;
    }

    public List<MetricSample> getReport(String metricName, OffsetDateTime start, OffsetDateTime end) {
        List<MetricSample> metrics;
        if (metricName == null || metricName.equalsIgnoreCase("all")) {
            metrics = repo.findByTsBetweenOrderByTsAsc(start, end);
        } else {
            metrics = repo.findByMetricNameAndTsBetweenOrderByTsAsc(metricName, start, end);
        }
        LogStrategy.info(log, LogEvents.METRIC_REPORT_GENERATED, "metric", metricName, "start", start, "end", end,
                "count", metrics.size());
        return metrics;
    }

    /**
     * Simple “dashboard cards” summary:
     * - best_block_number: latest value
     * - best_block_timestamp: latest value
     * - block_lag_seconds: latest value
     */

    /*
    * select id, metric_name, value, ts, source
    * from metric_samples
    * order by ts desc
    * limit 30;
    */

    public Map<String, Object> getSummary(String range) {
        OffsetDateTime since = sinceFromRange(range);
        List<MetricSample> samples = repo.findByTsAfterOrderByTsAsc(since);

        Map<String, List<MetricSample>> byName = samples.stream()
                .collect(Collectors.groupingBy(MetricSample::getMetricName));

        Double bestBlockNumber = latest(byName.get("best_block_number"));
        Double bestBlockTimestamp = latest(byName.get("best_block_timestamp"));
        Double blockLagSeconds = latest(byName.get("block_lag_seconds"));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("range", range == null ? "all" : range);
        out.put("bestBlockNumber", bestBlockNumber);
        out.put("bestBlockTimestamp", bestBlockTimestamp);
        out.put("blockLagSeconds", blockLagSeconds);
        out.put("source", "vechain_mainnet");

        LogStrategy.info(log, LogEvents.METRIC_SUMMARY_FETCHED,
                "range", out.get("range"),
                "sampleCount", samples.size());

        return out;
    }

    private Double latest(List<MetricSample> list) {
        if (list == null || list.isEmpty())
            return null;
        return list.get(list.size() - 1).getValue();
    }
}
