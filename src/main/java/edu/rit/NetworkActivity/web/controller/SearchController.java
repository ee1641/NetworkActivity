package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.MetricService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Auto-complete suggestions endpoint.
 *
 * Currently supports type=metric (metric names from the DB).
 * Address and label autocomplete will be added once the data-collection
 * sprint (friend's work) populates those tables.
 */
@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);
    private final MetricService metricService;

    public SearchController(MetricService metricService) {
        this.metricService = metricService;
    }

    /**
     * GET /api/search/autocomplete?q=best&type=metric
     *
     * Returns up to 10 matching suggestions.
     * type defaults to "metric" — other types will be added later.
     */
    @GetMapping("/autocomplete")
    public Map<String, Object> autocomplete(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "metric") String type) {

        List<String> suggestions = switch (type) {
            case "metric" -> metricService.getMetricNameSuggestions(q).stream().limit(10).toList();
            default       -> List.of();   // unsupported types return empty — not an error
        };

        LogStrategy.info(log, LogEvents.API_SEARCH_AUTOCOMPLETE,
                "type", type, "q", q, "hits", suggestions.size());

        return Map.of("type", type, "q", q, "suggestions", suggestions);
    }
}
