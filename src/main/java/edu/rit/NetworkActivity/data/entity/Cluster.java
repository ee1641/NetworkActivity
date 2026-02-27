package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clusters")
@Data
public class Cluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cluster_id")
    private Long clusterId;

    private String name;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "risk_level")
    private Float riskLevel;
}