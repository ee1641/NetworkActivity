package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

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
            case "7d"  -> now.minusDays(7);
            case "30d" -> now.minusDays(30);
            default    -> allSince;
        };

        LogStrategy.info(log, LogEvents.METRIC_RANGE_RESOLVED, "inputRange", range, "resolvedRange",
                since.equals(allSince) ? "all" : range);
        return since;
    }

    /**
     * Returns a page of time-series samples for a given metric.
     * Cached per (metricName, range, page, size) — TTL 30 s.
     */
    @Cacheable(value = "metric-timeseries", key = "#metricName + ':' + #range + ':' + #page + ':' + #size")
    public Page<MetricSample> getTimeSeries(String metricName, String range, int page, int size) {
        OffsetDateTime since = sinceFromRange(range);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("ts").ascending());
        Page<MetricSample> result = repo.findByMetricNameAndTsAfter(metricName, since, pageable);
        LogStrategy.info(log, LogEvents.METRIC_TIMESERIES_FETCHED,
                "metric", metricName, "range", range, "page", page, "size", size,
                "totalElements", result.getTotalElements());
        return result;
    }

    /**
     * Returns a page of samples in a date range (report endpoint).
     */
    public Page<MetricSample> getReport(String metricName, OffsetDateTime start, OffsetDateTime end,
            int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("ts").ascending());
        Page<MetricSample> result;
        if (metricName == null || metricName.equalsIgnoreCase("all")) {
            result = repo.findByTsBetween(start, end, pageable);
        } else {
            result = repo.findByMetricNameAndTsBetween(metricName, start, end, pageable);
        }
        LogStrategy.info(log, LogEvents.METRIC_REPORT_GENERATED,
                "metric", metricName, "start", start, "end", end,
                "page", page, "size", size, "totalElements", result.getTotalElements());
        return result;
    }

    /**
     * Dashboard summary: latest value per metric name.
     * Uses an optimised single-pass DB query instead of loading all rows.
     * Cached per range — TTL 15 s.
     */
    @Cacheable(value = "metric-summary", key = "#range == null ? 'all' : #range")
    public Map<String, Object> getSummary(String range) {
        OffsetDateTime since = sinceFromRange(range);

        // Optimised: one query that fetches only the latest row per metric name
        List<MetricSample> latest = repo.findLatestPerMetricSince(since);

        Map<String, Double> byName = new LinkedHashMap<>();
        for (MetricSample s : latest) {
            byName.put(s.getMetricName(), s.getValue());
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("range", range == null ? "all" : range);
        out.put("bestBlockNumber",    byName.get("best_block_number"));
        out.put("bestBlockTimestamp", byName.get("best_block_timestamp"));
        out.put("blockLagSeconds",    byName.get("block_lag_seconds"));
        out.put("source", "vechain_mainnet");

        LogStrategy.info(log, LogEvents.METRIC_SUMMARY_FETCHED,
                "range", out.get("range"), "rowsLoaded", latest.size());
        return out;
    }

    /**
     * Returns all distinct metric names whose name starts with the given prefix.
     * Cached — TTL 60 s.
     */
    @Cacheable(value = "metric-names", key = "#prefix")
    public List<String> getMetricNameSuggestions(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return repo.findAllDistinctMetricNames();
        }
        return repo.findDistinctMetricNamesStartingWith(prefix);
    }
}
