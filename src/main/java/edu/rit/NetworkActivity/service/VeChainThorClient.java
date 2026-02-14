package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@Service
public class VeChainThorClient {

    private static final Logger log = LoggerFactory.getLogger(VeChainThorClient.class);
    private static final String NODE_URL = "https://sync-mainnet.vechain.org"; // Public node
    private final RestTemplate restTemplate;

    public VeChainThorClient() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> getBestBlock() {
        String url = NODE_URL + "/blocks/best";
        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null)
                return Map.of("error", "No response from node");

            JSONObject json = new JSONObject(response);
            Map<String, Object> result = new HashMap<>();

            // Block details
            result.put("number", json.getLong("number"));
            result.put("id", json.getString("id"));
            result.put("timestamp", json.getLong("timestamp"));
            result.put("gasLimit", json.getLong("gasLimit"));
            result.put("gasUsed", json.getLong("gasUsed")); // VTHO burn proxy
            result.put("totalScore", json.getLong("totalScore"));

            // Transactions in this block
            if (json.has("transactions")) {
                result.put("txCount", json.getJSONArray("transactions").length());
            } else {
                result.put("txCount", 0);
            }

            LogStrategy.info(log, LogEvents.VECHAIN_CLIENT_FETCH, "blockNumber", result.get("number"), "txCount",
                    result.get("txCount"));
            return result;

        } catch (Exception e) {
            LogStrategy.error(log, LogEvents.VECHAIN_CLIENT_ERROR, e, "url", url);
            return Map.of("error", e.getMessage());
        }
    }
}
