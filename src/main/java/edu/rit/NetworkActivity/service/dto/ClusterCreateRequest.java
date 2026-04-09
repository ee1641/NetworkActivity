package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class ClusterCreateRequest {
    private String name;
    private String entityType;
    private Float riskLevel;
}

