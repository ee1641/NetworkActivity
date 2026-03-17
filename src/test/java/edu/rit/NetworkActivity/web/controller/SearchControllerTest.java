package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.MetricService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SearchControllerTest {

    @Mock MetricService metricService;
    @InjectMocks SearchController searchController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(searchController).build();
    }

    @Test
    void autocompleteMetricReturnsSuggestions() throws Exception {
        when(metricService.getMetricNameSuggestions("best"))
                .thenReturn(List.of("best_block_number", "best_block_timestamp"));

        mockMvc.perform(get("/api/search/autocomplete")
                        .param("q", "best")
                        .param("type", "metric"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("metric"))
                .andExpect(jsonPath("$.q").value("best"))
                .andExpect(jsonPath("$.suggestions[0]").value("best_block_number"))
                .andExpect(jsonPath("$.suggestions[1]").value("best_block_timestamp"));
    }

    @Test
    void autocompleteDefaultsToMetricType() throws Exception {
        when(metricService.getMetricNameSuggestions("")).thenReturn(List.of("best_block_number"));

        mockMvc.perform(get("/api/search/autocomplete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("metric"));

        verify(metricService).getMetricNameSuggestions("");
    }

    @Test
    void autocompleteUnknownTypeReturnsEmpty() throws Exception {
        mockMvc.perform(get("/api/search/autocomplete")
                        .param("type", "label"))   // not yet implemented
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestions").isEmpty());

        verifyNoInteractions(metricService);
    }

    @Test
    void autocompleteLimitsResultsTo10() throws Exception {
        List<String> many = List.of("a","b","c","d","e","f","g","h","i","j","k","l");
        when(metricService.getMetricNameSuggestions("a")).thenReturn(many);

        mockMvc.perform(get("/api/search/autocomplete")
                        .param("q", "a").param("type", "metric"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestions.length()").value(10));
    }
}
