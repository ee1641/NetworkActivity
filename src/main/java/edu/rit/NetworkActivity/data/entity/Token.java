package edu.rit.NetworkActivity.data.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tokens")
@Data
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_address")
    private String contractAddress;

    private String symbol;

    private String name;

    private Float decimals;

    private String type;
}