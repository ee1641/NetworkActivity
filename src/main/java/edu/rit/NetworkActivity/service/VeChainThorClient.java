package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class VeChainThorClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String thorServiceBaseUrl = "http://localhost:4010";

    public VeChainSummaryDto getSummary() {
        return restTemplate.getForObject(
                thorServiceBaseUrl + "/metrics/summary",
                VeChainSummaryDto.class
        );
    }
}
