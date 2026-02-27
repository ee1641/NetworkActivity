package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "labels")
@Data
public class Label {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "target_address")
    private String targetAddress;

    @Column(name = "label_text")
    private String labelText;

    private String category;

    private String source;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(nullable = false, unique = true)
    private String address;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "label_name", nullable = false)
    private String labelName;
}