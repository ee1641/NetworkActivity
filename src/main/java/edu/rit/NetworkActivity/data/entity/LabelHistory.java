package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Entity
@Table(name = "label_history")
@Data
public class LabelHistory {

    @Id
    private Long id;

    @Column(name = "label_id", nullable = false)
    private Long labelId;

    @Column(name = "changed_at")
    private OffsetDateTime changedAt;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(name = "new_value")
    private String newValue;

    @Column(name = "old_value")
    private String oldValue;
}