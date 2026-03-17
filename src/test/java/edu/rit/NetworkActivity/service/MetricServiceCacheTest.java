package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.config.CacheConfig;
import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Verifies @Cacheable on MetricService.getSummary() and getMetricNameSuggestions().
 *
 * Uses a minimal Spring context (no web, no DB) — just the cache infrastructure
 * and the service under test.
 */
@SpringJUnitConfig(classes = {MetricServiceCacheTest.TestConfig.class, CacheConfig.class, MetricService.class})
class MetricServiceCacheTest {

    @Configuration
    @EnableCaching
    static class TestConfig {
        @Bean
        MetricSampleRepository metricSampleRepository() {
            return mock(MetricSampleRepository.class);
        }
    }

    @Autowired MetricService metricService;
    @Autowired MetricSampleRepository mockRepo;
    @Autowired CacheManager cacheManager;

    @BeforeEach
    void resetState() {
        // Clear caches so each test starts cold
        cacheManager.getCacheNames().forEach(name -> cacheManager.getCache(name).clear());
        // Reset invocation counts so verify() only counts calls in this test
        reset(mockRepo);
        when(mockRepo.findLatestPerMetricSince(any())).thenReturn(List.of(
                new MetricSample("best_block_number", 12345.0,
                        OffsetDateTime.of(2024, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC),
                        "vechain_mainnet")));
        when(mockRepo.findAllDistinctMetricNames()).thenReturn(List.of("best_block_number", "block_lag_seconds"));
        when(mockRepo.findDistinctMetricNamesStartingWith(any())).thenReturn(List.of("best_block_number"));
    }

    // ── Summary caching ───────────────────────────────────────────────────────

    @Test
    void getSummaryHitsDbOnlyOnceForSameRange() {
        metricService.getSummary("24h");
        metricService.getSummary("24h");   // served from cache

        verify(mockRepo, times(1)).findLatestPerMetricSince(any());
    }

    @Test
    void getSummaryCallsDbAgainForDifferentRange() {
        metricService.getSummary("7d");
        metricService.getSummary("30d");   // different key → different cache entry

        verify(mockRepo, times(2)).findLatestPerMetricSince(any());
    }

    @Test
    void getSummaryReturnsBestBlockNumber() {
        var result = metricService.getSummary("24h");

        assertThat(result).containsKey("bestBlockNumber");
        assertThat((Double) result.get("bestBlockNumber")).isEqualTo(12345.0);
    }

    // ── Metric-name autocomplete caching ──────────────────────────────────────

    @Test
    void getMetricNameSuggestionsHitsDbOnlyOnceForSamePrefix() {
        metricService.getMetricNameSuggestions("best");
        metricService.getMetricNameSuggestions("best");

        verify(mockRepo, times(1)).findDistinctMetricNamesStartingWith("best");
    }

    @Test
    void getMetricNameSuggestionsWithBlankPrefixReturnsAll() {
        List<String> names = metricService.getMetricNameSuggestions("");

        assertThat(names).contains("best_block_number", "block_lag_seconds");
        verify(mockRepo, times(1)).findAllDistinctMetricNames();
    }
}
