package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class SearchLabelResultDto {
    private Long id;
    private String address;
    private String labelName;
    private String category;
    private String entityName;
    private String source;
}