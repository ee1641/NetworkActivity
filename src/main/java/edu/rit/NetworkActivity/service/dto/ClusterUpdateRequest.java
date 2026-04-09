package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class ClusterUpdateRequest {
    private String name;
    private String entityType;
    private Float riskLevel;
}

