package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

@Data
public class SearchResponseDto {
    private String query;
    private String detectedType;
    private SearchResultsDto results;
}