package edu.rit.NetworkActivity.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class VeChainThorClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String thorServiceBaseUrl = "http://localhost:4010";

    public Map<String, Object> getBestBlock() {
        return restTemplate.getForObject(
                thorServiceBaseUrl + "/metrics/summary",
                Map.class
        );
    }
}
