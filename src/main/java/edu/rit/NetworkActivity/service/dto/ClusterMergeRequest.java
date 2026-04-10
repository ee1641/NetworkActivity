package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class ClusterMergeRequest {
    private Long sourceClusterId;
    private Long targetClusterId;
}

