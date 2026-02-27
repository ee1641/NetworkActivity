package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "saved_reports")
@Data
public class SavedReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "query_parameters", columnDefinition = "json")
    private String queryParameters;

    private String schedule;

    @Column(name = "last_run")
    private OffsetDateTime lastRun;
}