package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface MetricSampleRepository extends JpaRepository<MetricSample, Long> {

    List<MetricSample> findByMetricNameAndTsAfterOrderByTsAsc(String metricName, OffsetDateTime since);

    List<MetricSample> findByTsAfterOrderByTsAsc(OffsetDateTime since);

    boolean existsByMetricName(String metricName);
}
