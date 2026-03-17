package edu.rit.NetworkActivity.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    /**
     * metric-summary: TTL 15s — data updates every 20s, so a 15s cache cuts
     * repeated identical DB fan-outs on every dashboard poll.
     *
     * metric-timeseries: TTL 30s — time-series doesn't change mid-second.
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.registerCustomCache("metric-summary",
                Caffeine.newBuilder().expireAfterWrite(15, TimeUnit.SECONDS).maximumSize(50).build());
        manager.registerCustomCache("metric-timeseries",
                Caffeine.newBuilder().expireAfterWrite(30, TimeUnit.SECONDS).maximumSize(200).build());
        manager.registerCustomCache("metric-names",
                Caffeine.newBuilder().expireAfterWrite(60, TimeUnit.SECONDS).maximumSize(20).build());
        return manager;
    }
}
