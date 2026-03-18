package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.service.FlowService;
import edu.rit.NetworkActivity.service.dto.FlowAddressSummaryDto;
import edu.rit.NetworkActivity.service.dto.FlowAggregateDto;
import edu.rit.NetworkActivity.service.dto.HotspotDto;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

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
            @RequestParam(required = false) String end) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getAggregate(startDate, endDate);
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
    public List<HotspotDto> hotspots(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(defaultValue = "10") int limit) {

        OffsetDateTime endDate = end != null ? OffsetDateTime.parse(end) : OffsetDateTime.now();
        OffsetDateTime startDate = start != null ? OffsetDateTime.parse(start) : endDate.minusHours(24);

        return flowService.getTopHotspots(startDate, endDate, limit);
    }
}