package edu.rit.NetworkActivity.service.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ClusterDto {
    Long clusterId;
    String name;
    String entityType;
    Float riskLevel;
}

