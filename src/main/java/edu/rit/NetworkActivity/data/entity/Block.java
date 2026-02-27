package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Entity
@Table(name = "blocks")
@Data
public class Block {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long blockNumber;

    private String blockHash;

    private Float size;

    @Column(nullable = false)
    private OffsetDateTime timestamp;
}