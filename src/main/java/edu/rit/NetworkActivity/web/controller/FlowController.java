package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.service.FlowService;
import edu.rit.NetworkActivity.service.dto.FlowAddressSummaryDto;
import edu.rit.NetworkActivity.service.dto.FlowAggregateDto;
import edu.rit.NetworkActivity.service.dto.HotspotDto;
import edu.rit.NetworkActivity.service.dto.HotspotPageDto;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flows")
@CrossOrigin(origins = "*")
public class FlowController {

    private final FlowService flowService;

    public FlowController(FlowService flowService) {
        this.flowService = flowService;
    }

    @GetMapping("/aggregate")
    public FlowAggregateDto aggregate(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Float minVolume,
            @RequestParam(required = false) Float maxVolume) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getAggregate(startDate, endDate, address, minVolume, maxVolume);
    }

    @GetMapping("/volume-timeseries")
    public List<Map<String, Object>> volumeTimeSeries(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getVolumeTimeSeries(startDate, endDate);
    }

    @GetMapping("/cluster-stats")
    public Map<String, Object> clusterStats(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getClusterStatistics(startDate, endDate);
    }

    @GetMapping("/address/{address}")
    public List<Transaction> addressTransactions(
            @PathVariable String address,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getTransactionsForAddress(address, startDate, endDate);
    }

    @GetMapping("/address/{address}/summary")
    public FlowAddressSummaryDto addressSummary(
            @PathVariable String address,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getAddressSummary(address, startDate, endDate);
    }

    @GetMapping("/hotspots")
    public HotspotPageDto hotspots(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "transactions") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int pageSize) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        long periodSeconds = java.time.Duration.between(startDate, endDate).getSeconds();
        OffsetDateTime priorStart = startDate.minusSeconds(periodSeconds);

        int safePageSize = Math.max(1, Math.min(pageSize, 100));

        return flowService.getTopHotspots(startDate, endDate, priorStart, category, sortBy, page, safePageSize);
    }

    @GetMapping("/large-transactions")
    public List<Transaction> largeTransactions(
            @RequestParam(defaultValue = "1000") Float minValue,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(defaultValue = "10") int limit) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        int safeLimit = Math.max(1, Math.min(limit, 100));

        return flowService.getLargeTransactions(minValue, startDate, endDate, safeLimit);
    }
}