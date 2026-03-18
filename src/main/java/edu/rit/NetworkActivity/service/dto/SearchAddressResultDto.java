package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class SearchAddressResultDto {
    private Long id;
    private String address;
    private String type;
    private Float balance;
    private Float riskScore;
}