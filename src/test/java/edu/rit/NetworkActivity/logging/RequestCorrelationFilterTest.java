package edu.rit.NetworkActivity.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class RequestCorrelationFilterTest {

    private final RequestCorrelationFilter filter = new RequestCorrelationFilter();

    @Test
    void usesIncomingRequestIdAndClearsMdcAfterRequest() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/metrics/summary");
        request.addHeader(RequestCorrelationFilter.REQUEST_ID_HEADER, "req-123");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicReference<String> traceSeenByChain = new AtomicReference<>();

        FilterChain chain = (req, res) ->
                traceSeenByChain.set(MDC.get(RequestCorrelationFilter.TRACE_ID_KEY));

        filter.doFilter(request, response, chain);

        assertEquals("req-123", traceSeenByChain.get());
        assertEquals("req-123", response.getHeader(RequestCorrelationFilter.REQUEST_ID_HEADER));
        assertNull(MDC.get(RequestCorrelationFilter.TRACE_ID_KEY));
    }

    @Test
    void generatesRequestIdWhenMissing() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/metrics/timeseries");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicReference<String> traceSeenByChain = new AtomicReference<>();

        FilterChain chain = (req, res) ->
                traceSeenByChain.set(MDC.get(RequestCorrelationFilter.TRACE_ID_KEY));

        filter.doFilter(request, response, chain);

        String responseHeader = response.getHeader(RequestCorrelationFilter.REQUEST_ID_HEADER);
        assertNotNull(responseHeader);
        assertEquals(responseHeader, traceSeenByChain.get());
        assertNull(MDC.get(RequestCorrelationFilter.TRACE_ID_KEY));
    }
}
