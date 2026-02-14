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
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;

@Service
public class MetricCollector {

    private static final Logger log = LoggerFactory.getLogger(MetricCollector.class);
    private final VeChainThorClient veChainClient;
    private final MetricSampleRepository metricRepository;

    public MetricCollector(VeChainThorClient veChainClient, MetricSampleRepository metricRepository) {
        this.veChainClient = veChainClient;
        this.metricRepository = metricRepository;
    }

    // Run every 10 seconds
    @Scheduled(fixedRate = 10000)
    public void collectMetrics() {
        Map<String, Object> blockData = veChainClient.getBestBlock();

        if (blockData.containsKey("error")) {
            LogStrategy.warn(log, LogEvents.METRIC_COLLECT_SKIPPED, "reason", blockData.get("error"));
            return;
        }

        try {
            long timestamp = ((Number) blockData.get("timestamp")).longValue();
            OffsetDateTime ts = OffsetDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneOffset.UTC);
            // If block is older than 1 minute, use current time to ensure recent data
            // points in UI
            if (ts.isBefore(OffsetDateTime.now().minusMinutes(1))) {
                ts = OffsetDateTime.now();
            }

            String source = "vechain_mainnet";

            // Save Transaction Count
            double txCount = ((Number) blockData.get("txCount")).doubleValue();
            saveMetric("tx_count", txCount, ts, source);

            // Save VTHO Burn (Gas Used)
            double gasUsed = ((Number) blockData.get("gasUsed")).doubleValue();
            saveMetric("vtho_burn", gasUsed, ts, source);

            // Mock Active Wallets (Real extraction requires expanding txs which is heavy
            // for this demo)
            // Simulating a value based on tx count for now
            double activeWallets = txCount * 1.5 + (Math.random() * 10);
            saveMetric("active_wallets", activeWallets, ts, source);

            // Mock Success Rate (Usually high in VeChain)
            saveMetric("success_rate", 99.0 + (Math.random()), ts, source);

            LogStrategy.info(log, LogEvents.METRIC_COLLECT_SUCCESS, "block", blockData.get("number"), "txCount",
                    txCount);

        } catch (Exception e) {
            LogStrategy.error(log, LogEvents.METRIC_COLLECT_ERROR, e);
        }
    }

    private void saveMetric(String name, Double value, OffsetDateTime ts, String source) {
        MetricSample sample = new MetricSample(name, value, ts, source);
        metricRepository.save(sample);
    }
}
