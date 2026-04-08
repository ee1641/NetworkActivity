package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Entity
@Table(name = "label_history")
@Data
public class LabelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "label_id")
    private Long labelId;

    @Column(name = "address")
    private String address;

    @Column(name = "action")
    private String action;

    @Column(name = "changed_at")
    private OffsetDateTime changedAt;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(name = "new_value")
    private String newValue;

    @Column(name = "old_value")
    private String oldValue;
}