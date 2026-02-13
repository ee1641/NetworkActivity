package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import edu.rit.NetworkActivity.data.repository.MetricSampleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.concurrent.ThreadLocalRandom;

//PALCEHOLDER CLASS UNTIL WE GET VECHAIN API
//CLASS GENERATED FOR SAMPLE DATA
//http://localhost:8080/api/metrics/summary?range=24h
//http://localhost:8080/api/metrics/timeseries?metric=tx_count&range=24h
@Service
public class StubMetricCollector implements MetricCollector {

    private final MetricSampleRepository repo;

    public StubMetricCollector(MetricSampleRepository repo) {
        this.repo = repo;
    }

    @Override
    @Scheduled(fixedRate = 60_000) // every 60s
    public void collectOnce() {
        OffsetDateTime now = OffsetDateTime.now();
        String source = "stub";

        // You can tune these later to match UI expectations
        save("tx_count", rand(50, 200), now, source);
        save("tx_volume", rand(10000, 50000), now, source);      // e.g. USD-ish
        save("active_wallets", rand(2000, 6000), now, source);
        save("success_rate", rand(95.0, 99.9), now, source);     // percent
    }

    private void save(String name, double value, OffsetDateTime ts, String source) {
        repo.save(new MetricSample(name, value, ts, source));
    }

    private double rand(double min, double max) {
        return ThreadLocalRandom.current().nextDouble(min, max);
    }
}
