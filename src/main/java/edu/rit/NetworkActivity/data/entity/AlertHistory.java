package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Entity
@Table(name = "alert_history")
@Data
public class AlertHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "rule_id")
    private Long ruleId;

    @Column(name = "triggered_at")
    private OffsetDateTime triggeredAt;

    @Column(columnDefinition = "json")
    private String details;
}