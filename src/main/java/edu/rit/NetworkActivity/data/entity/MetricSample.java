package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "metric_samples",
        indexes = {
                @Index(name = "idx_metric_name_ts", columnList = "metricName, ts")
        }
)
public class MetricSample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String metricName; // e.g. tx_count, tx_volume, active_wallets, success_rate

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private OffsetDateTime ts;

    @Column(nullable = false)
    private String source; // waiting for vechain

    public MetricSample() {}

    public MetricSample(String metricName, Double value, OffsetDateTime ts, String source) {
        this.metricName = metricName;
        this.value = value;
        this.ts = ts;
        this.source = source;
    }

    public Long getId() { return id; }
    public String getMetricName() { return metricName; }
    public Double getValue() { return value; }
    public OffsetDateTime getTs() { return ts; }
    public String getSource() { return source; }

    public void setId(Long id) { this.id = id; }
    public void setMetricName(String metricName) { this.metricName = metricName; }
    public void setValue(Double value) { this.value = value; }
    public void setTs(OffsetDateTime ts) { this.ts = ts; }
    public void setSource(String source) { this.source = source; }
}
