package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.MetricService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "*")
public class MetricsController {

    private static final Logger log = LoggerFactory.getLogger(MetricsController.class);
    private final MetricService metricService;

    public MetricsController(MetricService metricService) {
        this.metricService = metricService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam(required = false) String range) {
        Map<String, Object> summary = metricService.getSummary(range);
        LogStrategy.info(log, LogEvents.API_METRICS_SUMMARY, "range", range);
        return summary;
    }

    /**
     * GET /api/metrics/timeseries?metric=&range=&page=0&size=100
     *
     * Returns a paginated time-series. Default page size 100; max enforced at 500
     * to prevent accidental full-table dumps.
     */
    @GetMapping("/timeseries")
    public Page<MetricSample> timeseries(
            @RequestParam String metric,
            @RequestParam(required = false) String range,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        int safeSize = Math.min(size, 500);
        Page<MetricSample> result = metricService.getTimeSeries(metric, range, page, safeSize);
        LogStrategy.info(log, LogEvents.API_METRICS_TIMESERIES,
                "metric", metric, "range", range, "page", page, "size", safeSize,
                "totalElements", result.getTotalElements());
        return result;
    }

    /**
     * GET /api/metrics/report?metric=&start=&end=&page=0&size=200
     */
    @GetMapping("/report")
    public Page<MetricSample> report(
            @RequestParam(required = false) String metric,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size) {
        OffsetDateTime endDate   = (end   != null) ? OffsetDateTime.parse(end)   : OffsetDateTime.now();
        OffsetDateTime startDate = (start != null) ? OffsetDateTime.parse(start) : endDate.minusHours(24);
        int safeSize = Math.min(size, 1000);
        Page<MetricSample> result = metricService.getReport(metric, startDate, endDate, page, safeSize);
        LogStrategy.info(log, LogEvents.API_METRICS_REPORT,
                "metric", metric, "start", startDate, "end", endDate,
                "page", page, "size", safeSize, "totalElements", result.getTotalElements());
        return result;
    }
}
