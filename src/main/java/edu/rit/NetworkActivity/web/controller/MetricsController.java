package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.service.MetricService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "*")
public class MetricsController {

    private final MetricService metricService;

    public MetricsController(MetricService metricService) {
        this.metricService = metricService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(@RequestParam(required = false) String range) {
        return metricService.getSummary(range);
    }

    @GetMapping("/timeseries")
    public List<MetricSample> timeseries(
            @RequestParam String metric,
            @RequestParam(required = false) String range
    ) {
        return metricService.getTimeSeries(metric, range);
    }
}
