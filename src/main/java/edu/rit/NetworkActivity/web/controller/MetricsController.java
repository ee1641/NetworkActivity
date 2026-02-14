package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.MetricService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
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
        LogStrategy.info(log, LogEvents.API_METRICS_SUMMARY, "range", range, "txCount", summary.get("txCount"));
        return summary;
    }

    @GetMapping("/timeseries")
    public List<MetricSample> timeseries(
            @RequestParam String metric,
            @RequestParam(required = false) String range) {
        List<MetricSample> series = metricService.getTimeSeries(metric, range);
        LogStrategy.info(log, LogEvents.API_METRICS_TIMESERIES, "metric", metric, "range", range, "count",
                series.size());
        return series;
    }

    @GetMapping("/report")
    public List<MetricSample> report(
            @RequestParam(required = false) String metric,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        // Default to last 24h if not provided
        OffsetDateTime endDate = (end != null) ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = (start != null) ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return metricService.getReport(metric, startDate, endDate);
    }
}
