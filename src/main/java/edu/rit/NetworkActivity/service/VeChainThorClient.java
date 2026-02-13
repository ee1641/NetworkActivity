package edu.rit.NetworkActivity.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VeChainThorClient {

    //Placeholder
    //http://localhost:8080/api/vechain/status
    public Map<String, Object> getBestBlock() {
        return Map.of(
                "status", "SDK not connected yet",
                "message", "VeChain integration skeleton ready"
        );
    }
}

