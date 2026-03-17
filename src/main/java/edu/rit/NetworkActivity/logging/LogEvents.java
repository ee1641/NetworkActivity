package edu.rit.NetworkActivity.logging;

public final class LogEvents {

    // ── Metric pipeline ───────────────────────────────────────────────────────
    public static final String METRIC_RANGE_RESOLVED      = "metric.range.resolved";
    public static final String METRIC_TIMESERIES_FETCHED  = "metric.timeseries.fetched";
    public static final String METRIC_SUMMARY_FETCHED     = "metric.summary.fetched";
    public static final String METRIC_REPORT_GENERATED    = "metric.report.generated";

    // ── Metric collector ──────────────────────────────────────────────────────
    public static final String METRIC_COLLECT_SUCCESS     = "metric.collect.success";
    public static final String METRIC_COLLECT_SKIPPED     = "metric.collect.skipped";
    public static final String METRIC_COLLECT_ERROR       = "metric.collect.error";

    // ── API: metrics ──────────────────────────────────────────────────────────
    public static final String API_METRICS_SUMMARY        = "api.metrics.summary";
    public static final String API_METRICS_TIMESERIES     = "api.metrics.timeseries";
    public static final String API_METRICS_REPORT         = "api.metrics.report";

    // ── API: posts ────────────────────────────────────────────────────────────
    public static final String API_POST_LIST              = "api.post.list";
    public static final String API_POST_GET               = "api.post.get";
    public static final String API_POST_CREATE            = "api.post.create";
    public static final String API_POST_UPDATE            = "api.post.update";
    public static final String API_POST_DELETE            = "api.post.delete";
    public static final String API_POST_NOT_FOUND         = "api.post.not_found";

    // ── API: VeChain ──────────────────────────────────────────────────────────
    public static final String API_VECHAIN_STATUS         = "api.vechain.status";
    public static final String API_VECHAIN_BLOCK          = "api.vechain.block";
    public static final String API_VECHAIN_TX             = "api.vechain.tx";
    public static final String API_VECHAIN_ACCOUNT        = "api.vechain.account";
    public static final String API_VECHAIN_NOT_FOUND      = "api.vechain.not_found";

    // ── VeChain client ────────────────────────────────────────────────────────
    public static final String VECHAIN_CLIENT_FETCH       = "vechain.client.fetch";
    public static final String VECHAIN_CLIENT_ERROR       = "vechain.client.error";

    // ── Search ────────────────────────────────────────────────────────────────
    public static final String API_SEARCH_AUTOCOMPLETE    = "api.search.autocomplete";

    // ── Role management ───────────────────────────────────────────────────────
    public static final String API_ROLE_GET               = "api.role.get";
    public static final String API_ROLE_UPDATE            = "api.role.update";
    public static final String API_ROLE_NOT_FOUND         = "api.role.not_found";

    private LogEvents() {}
}
