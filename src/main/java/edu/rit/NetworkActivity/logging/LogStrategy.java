package edu.rit.NetworkActivity.logging;

import org.slf4j.Logger;

import java.util.Locale;
import java.util.Set;

public final class LogStrategy {

    private static final Set<String> SENSITIVE_KEYS = Set.of(
            "password",
            "passwd",
            "secret",
            "token",
            "apikey",
            "api_key",
            "authorization"
    );

    private LogStrategy() {
    }

    public static void info(Logger logger, String event, Object... keyValues) {
        logger.info("{} {}", event, context(keyValues));
    }

    public static void warn(Logger logger, String event, Object... keyValues) {
        logger.warn("{} {}", event, context(keyValues));
    }

    public static void error(Logger logger, String event, Throwable throwable, Object... keyValues) {
        logger.error("{} {}", event, context(keyValues), throwable);
    }

    static String context(Object... keyValues) {
        if (keyValues == null || keyValues.length == 0) {
            return "no_context";
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < keyValues.length; i += 2) {
            String key = String.valueOf(keyValues[i]);
            Object value = (i + 1 < keyValues.length) ? keyValues[i + 1] : "<missing>";

            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(normalize(key))
                    .append('=')
                    .append(maskIfSensitive(key, value));
        }
        return sb.toString();
    }

    private static String maskIfSensitive(String key, Object value) {
        String normalizedKey = key == null ? "" : key.toLowerCase(Locale.ROOT);
        if (SENSITIVE_KEYS.contains(normalizedKey)) {
            return "***";
        }
        return normalize(String.valueOf(value));
    }

    private static String normalize(String value) {
        if (value == null || value.isBlank()) {
            return "n/a";
        }
        return value.replaceAll("\\s+", "_");
    }
}
