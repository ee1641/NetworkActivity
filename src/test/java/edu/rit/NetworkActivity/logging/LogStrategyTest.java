package edu.rit.NetworkActivity.logging;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LogStrategyTest {

    @Test
    void contextReturnsNoContextWhenEmpty() {
        assertEquals("no_context", LogStrategy.context());
    }

    @Test
    void contextMasksSensitiveValues() {
        String context = LogStrategy.context(
                "metric", "tx_count",
                "token", "abc123",
                "password", "my-pass"
        );

        assertTrue(context.contains("metric=tx_count"));
        assertTrue(context.contains("token=***"));
        assertTrue(context.contains("password=***"));
    }

    @Test
    void contextHandlesOddNumberOfArgs() {
        String context = LogStrategy.context("metric", "tx_count", "range");
        assertTrue(context.contains("metric=tx_count"));
        assertTrue(context.contains("range=<missing>"));
    }
}
