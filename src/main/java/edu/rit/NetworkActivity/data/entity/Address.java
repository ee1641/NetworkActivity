package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Entity
@Table(name = "addresses")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String address;

    private String type;

    private Float balance;

    @Column(name = "first_seen")
    private OffsetDateTime firstSeen;

    @Column(name = "last_active")
    private OffsetDateTime lastActive;

    @Column(name = "risk_score")
    private Float riskScore;
}