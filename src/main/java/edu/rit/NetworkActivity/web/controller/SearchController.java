package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.MetricService;
import edu.rit.NetworkActivity.service.SearchService;
import edu.rit.NetworkActivity.service.dto.SearchResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//http://localhost:8080/api/search?q=0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a
//http://localhost:8080/api/labels?category=Wallet
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

    private final MetricService metricService;
    private final SearchService searchService;

    public SearchController(MetricService metricService, SearchService searchService) {
        this.metricService = metricService;
        this.searchService = searchService;
    }

    @GetMapping
    public SearchResponseDto search(@RequestParam String q) {
        SearchResponseDto response = searchService.search(q);

        LogStrategy.info(log, LogEvents.API_SEARCH_AUTOCOMPLETE,
                "endpoint", "search",
                "q", q,
                "detectedType", response.getDetectedType());

        return response;
    }

    @GetMapping("/autocomplete")
    public Map<String, Object> autocomplete(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "metric") String type) {

        List<String> suggestions = switch (type) {
            case "metric" -> metricService.getMetricNameSuggestions(q).stream().limit(10).toList();
            default -> List.of();
        };

        LogStrategy.info(log, LogEvents.API_SEARCH_AUTOCOMPLETE,
                "type", type, "q", q, "hits", suggestions.size());

        return Map.of("type", type, "q", q, "suggestions", suggestions);
    }
}