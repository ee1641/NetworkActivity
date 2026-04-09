package edu.rit.NetworkActivity.service.dto;

import lombok.Builder;
import lombok.Value;

import java.time.OffsetDateTime;

@Value
@Builder
public class ClusterEventDto {
    Long id;
    Long clusterId;
    String eventType;
    OffsetDateTime eventTs;
    String summary;
    String actor;
}

