package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.RiskService;
import edu.rit.NetworkActivity.service.dto.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin(origins = "*")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping("/summary")
    public RiskSummaryDto getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end,
            @RequestParam(defaultValue = "75")   float anomalyThreshold,
            @RequestParam(defaultValue = "1000") float largeTxThreshold,
            @RequestParam(defaultValue = "50")   float activitySpikePercent) {

        OffsetDateTime resolvedEnd   = end   != null ? end   : OffsetDateTime.now();
        OffsetDateTime resolvedStart = start != null ? start : resolvedEnd.minusHours(24);
        return riskService.getRiskSummary(resolvedStart, resolvedEnd,
                anomalyThreshold, largeTxThreshold, activitySpikePercent);
    }

    @GetMapping("/anomaly-timeseries")
    public List<AnomalyPointDto> getAnomalyTimeSeries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end) {

        OffsetDateTime resolvedEnd   = end   != null ? end   : OffsetDateTime.now();
        OffsetDateTime resolvedStart = start != null ? start : resolvedEnd.minusHours(24);
        return riskService.getAnomalyTimeSeries(resolvedStart, resolvedEnd);
    }

    @GetMapping("/incidents")
    public List<RiskIncidentDto> getIncidents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end,
            @RequestParam(defaultValue = "1000") float largeTxThreshold,
            @RequestParam(defaultValue = "20")   int limit) {

        OffsetDateTime resolvedEnd   = end   != null ? end   : OffsetDateTime.now();
        OffsetDateTime resolvedStart = start != null ? start : resolvedEnd.minusHours(24);
        return riskService.getRiskIncidents(resolvedStart, resolvedEnd, largeTxThreshold, limit);
    }

    @GetMapping("/alert-config")
    public AlertConfigDto getAlertConfig() {
        return riskService.getAlertConfig();
    }

    @PostMapping("/alert-config")
    public AlertConfigDto saveAlertConfig(@RequestBody AlertConfigDto cfg) {
        riskService.saveAlertConfig(cfg);
        return cfg;
    }
}
