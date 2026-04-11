package edu.rit.NetworkActivity.service.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ClusterWalletDto {
    Long walletId;
    String address;
}
