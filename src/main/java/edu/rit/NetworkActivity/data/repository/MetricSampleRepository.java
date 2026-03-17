package edu.rit.NetworkActivity.data.repository;

import edu.rit.NetworkActivity.data.entity.MetricSample;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface MetricSampleRepository extends JpaRepository<MetricSample, Long> {

    // ── existing list queries (kept for backwards-compat) ─────────────────────

    List<MetricSample> findByMetricNameAndTsAfterOrderByTsAsc(String metricName, OffsetDateTime since);

    List<MetricSample> findByTsAfterOrderByTsAsc(OffsetDateTime since);

    List<MetricSample> findByTsBetweenOrderByTsAsc(OffsetDateTime start, OffsetDateTime end);

    List<MetricSample> findByMetricNameAndTsBetweenOrderByTsAsc(String metricName, OffsetDateTime start,
            OffsetDateTime end);

    boolean existsByMetricName(String metricName);

    // ── paginated variants ────────────────────────────────────────────────────

    Page<MetricSample> findByMetricNameAndTsAfter(String metricName, OffsetDateTime since, Pageable pageable);

    Page<MetricSample> findByTsBetween(OffsetDateTime start, OffsetDateTime end, Pageable pageable);

    Page<MetricSample> findByMetricNameAndTsBetween(String metricName, OffsetDateTime start, OffsetDateTime end,
            Pageable pageable);

    // ── optimised summary query: latest value per metric name ─────────────────
    // Avoids loading every sample into Java memory and grouping there.

    @Query("""
            SELECT s FROM MetricSample s
            WHERE s.ts = (
                SELECT MAX(s2.ts) FROM MetricSample s2 WHERE s2.metricName = s.metricName
            )
            AND s.ts >= :since
            """)
    List<MetricSample> findLatestPerMetricSince(@Param("since") OffsetDateTime since);

    // ── autocomplete: distinct metric names matching a prefix ─────────────────

    @Query("SELECT DISTINCT s.metricName FROM MetricSample s WHERE s.metricName LIKE :prefix% ORDER BY s.metricName")
    List<String> findDistinctMetricNamesStartingWith(@Param("prefix") String prefix);

    @Query("SELECT DISTINCT s.metricName FROM MetricSample s ORDER BY s.metricName")
    List<String> findAllDistinctMetricNames();

    // ── latest single value for a given metric name ───────────────────────────

    @Query("SELECT s FROM MetricSample s WHERE s.metricName = :name ORDER BY s.ts DESC LIMIT 1")
    Optional<MetricSample> findLatestByMetricName(@Param("name") String name);
}
