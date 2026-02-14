package edu.rit.NetworkActivity.logging;

public final class LogEvents {

    public static final String METRIC_RANGE_RESOLVED = "metric.range.resolved";
    public static final String METRIC_TIMESERIES_FETCHED = "metric.timeseries.fetched";
    public static final String METRIC_SUMMARY_FETCHED = "metric.summary.fetched";
    public static final String API_METRICS_SUMMARY = "api.metrics.summary";
    public static final String API_METRICS_TIMESERIES = "api.metrics.timeseries";

    // VeChain Client
    public static final String VECHAIN_CLIENT_FETCH = "vechain.client.fetch";
    public static final String VECHAIN_CLIENT_ERROR = "vechain.client.error";

    // Metric Collector
    public static final String METRIC_COLLECT_SUCCESS = "metric.collect.success";
    public static final String METRIC_COLLECT_SKIPPED = "metric.collect.skipped";
    public static final String METRIC_COLLECT_ERROR = "metric.collect.error";

    // Reporting
    public static final String METRIC_REPORT_GENERATED = "metric.report.generated";

    private LogEvents() {
    }
}
