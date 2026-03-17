package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.service.MetricService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class MetricsControllerPaginationTest {

    @Mock MetricService metricService;
    @InjectMocks MetricsController metricsController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(metricsController).build();
    }

    private MetricSample makeSample(String name, double value) {
        return new MetricSample(name, value,
                OffsetDateTime.of(2024, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC), "vechain_mainnet");
    }

    // ── /api/metrics/summary ──────────────────────────────────────────────────

    @Test
    void summaryReturnsSummaryMap() throws Exception {
        when(metricService.getSummary("24h")).thenReturn(
                Map.of("range", "24h", "bestBlockNumber", 12345.0, "source", "vechain_mainnet"));

        mockMvc.perform(get("/api/metrics/summary").param("range", "24h"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bestBlockNumber").value(12345.0))
                .andExpect(jsonPath("$.source").value("vechain_mainnet"));
    }

    // ── /api/metrics/timeseries ───────────────────────────────────────────────

    @Test
    void timeseriesReturnsPaginatedResult() throws Exception {
        List<MetricSample> samples = List.of(makeSample("best_block_number", 1.0));
        Page<MetricSample> page = new PageImpl<>(samples, PageRequest.of(0, 100), 300);
        when(metricService.getTimeSeries(eq("best_block_number"), eq("24h"), eq(0), eq(100)))
                .thenReturn(page);

        mockMvc.perform(get("/api/metrics/timeseries")
                        .param("metric", "best_block_number")
                        .param("range", "24h")
                        .param("page", "0")
                        .param("size", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(300))
                .andExpect(jsonPath("$.content[0].metricName").value("best_block_number"));
    }

    @Test
    void timeseriesEnforcesSizeCapAt500() throws Exception {
        Page<MetricSample> page = new PageImpl<>(List.of(), PageRequest.of(0, 500), 0);
        when(metricService.getTimeSeries(anyString(), any(), eq(0), eq(500))).thenReturn(page);

        mockMvc.perform(get("/api/metrics/timeseries")
                        .param("metric", "best_block_number")
                        .param("size", "99999"))
                .andExpect(status().isOk());

        verify(metricService).getTimeSeries(anyString(), any(), eq(0), eq(500));
    }

    // ── /api/metrics/report ───────────────────────────────────────────────────

    @Test
    void reportReturnsPaginatedResult() throws Exception {
        List<MetricSample> samples = List.of(makeSample("block_lag_seconds", 5.0));
        Page<MetricSample> page = new PageImpl<>(samples, PageRequest.of(0, 200), 1);
        when(metricService.getReport(isNull(), any(), any(), anyInt(), anyInt())).thenReturn(page);

        mockMvc.perform(get("/api/metrics/report"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].value").value(5.0));
    }
}
