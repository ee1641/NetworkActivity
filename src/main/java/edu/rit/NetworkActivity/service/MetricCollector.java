package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
public class MetricCollector {

    private static final Logger log = LoggerFactory.getLogger(MetricCollector.class);
    private final VeChainThorClient veChainClient;
    private final MetricSampleRepository metricRepository;

    public MetricCollector(VeChainThorClient veChainClient, MetricSampleRepository metricRepository) {
        this.veChainClient = veChainClient;
        this.metricRepository = metricRepository;
    }

    @Scheduled(fixedRate = 20000)
    public void collectMetrics() {
        try {
            var dto = veChainClient.getSummary();

            if (dto == null) {
                LogStrategy.warn(log, LogEvents.METRIC_COLLECT_SKIPPED, "reason", "null_response");
                return;
            }

            // If node returns an error shape, or some unexpected JSON
            if (!"vechain-sdk".equals(dto.getSource())) {
                LogStrategy.warn(log, LogEvents.METRIC_COLLECT_SKIPPED,
                        "reason", "invalid_source",
                        "source", dto.getSource(),
                        "message", dto.getMessage());
                return;
            }

            if (dto.getBestBlockNumber() == null || dto.getBestBlockTimestamp() == null) {
                LogStrategy.warn(log, LogEvents.METRIC_COLLECT_SKIPPED,
                        "reason", "missing_fields",
                        "bestBlockNumber", dto.getBestBlockNumber(),
                        "bestBlockTimestamp", dto.getBestBlockTimestamp());
                return;
            }

            // Convert chain timestamp -> OffsetDateTime
            OffsetDateTime ts = OffsetDateTime.ofInstant(
                    Instant.ofEpochSecond(dto.getBestBlockTimestamp()),
                    ZoneOffset.UTC);

            String source = "vechain_mainnet";

            // Store real metrics we actually have
            saveMetric("best_block_number", dto.getBestBlockNumber().doubleValue(), ts, source);
            saveMetric("best_block_timestamp", dto.getBestBlockTimestamp().doubleValue(), ts, source);

            // Derived metric: how “stale” the chain time is compared to now
            long lagSeconds = Math.max(0,
                    OffsetDateTime.now(ZoneOffset.UTC).toEpochSecond() - dto.getBestBlockTimestamp());
            saveMetric("block_lag_seconds", (double) lagSeconds, OffsetDateTime.now(ZoneOffset.UTC), source);

            LogStrategy.info(log, LogEvents.METRIC_COLLECT_SUCCESS,
                    "bestBlockNumber", dto.getBestBlockNumber(),
                    "bestBlockId", dto.getBestBlockId(),
                    "bestBlockTimestamp", dto.getBestBlockTimestamp(),
                    "lagSeconds", lagSeconds);

        } catch (Exception e) {
            LogStrategy.error(log, LogEvents.METRIC_COLLECT_ERROR, e);
        }
    }

    private void saveMetric(String name, Double value, OffsetDateTime ts, String source) {
        MetricSample sample = new MetricSample(name, value, ts, source);
        metricRepository.save(sample);
    }
}
