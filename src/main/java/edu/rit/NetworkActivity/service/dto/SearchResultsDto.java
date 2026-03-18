package edu.rit.NetworkActivity.service.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SearchResultsDto {
    private List<SearchAddressResultDto> addresses = new ArrayList<>();
    private List<SearchLabelResultDto> labels = new ArrayList<>();
    private List<Object> transactions = new ArrayList<>();
    private List<Object> blocks = new ArrayList<>();
}