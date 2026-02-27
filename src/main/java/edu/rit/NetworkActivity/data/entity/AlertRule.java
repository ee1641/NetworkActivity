package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "alert_rules")
@Data
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Long ruleId;

    @Column(name = "user_id")
    private UUID userId;

    private String type;

    @Column(name = "threshold_value")
    private Float thresholdValue;

    @Column(name = "target_token")
    private Long targetToken;

    @Column(name = "notification_method")
    private String notificationMethod;
}