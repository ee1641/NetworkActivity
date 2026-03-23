package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class VeChainThorClient {

    private final RestTemplate restTemplate;
    private final String thorServiceBaseUrl = "http://localhost:4010";

    public VeChainThorClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000); // 5 s — fail fast if thor-sdk is down
        factory.setReadTimeout(10_000); // 10 s — give the VeChain node time to respond
        this.restTemplate = new RestTemplate(factory);
    }

    /** Returns best-block summary used by MetricCollector. */
    public VeChainSummaryDto getSummary() {
        return restTemplate.getForObject(
                thorServiceBaseUrl + "/metrics/summary",
                VeChainSummaryDto.class);
    }

    /**
     * Fetches a full block by block number (integer string) or block ID (0x… hex).
     * Returns null when the block is not found.
     */
    public Map<String, Object> getBlock(String numberOrId) {
        return fetchBlock(numberOrId, false);
    }

    /**
     * Fetches a full block including expanded transaction details.
     */
    public Map<String, Object> getBlockExpanded(String numberOrId) {
        return fetchBlock(numberOrId, true);
    }

    private Map<String, Object> fetchBlock(String numberOrId, boolean expanded) {
        try {
            String url = thorServiceBaseUrl + "/block/" + numberOrId + (expanded ? "?expanded=true" : "");
            @SuppressWarnings("unchecked")
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            return result;
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    /**
     * Fetches a transaction by its 0x-prefixed transaction ID.
     * Returns null when the transaction is not found.
     */
    public Map<String, Object> getTransaction(String txId) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = restTemplate.getForObject(
                    thorServiceBaseUrl + "/tx/" + txId,
                    Map.class);
            return result;
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    /**
     * Fetches VET/VTHO account details for a VeChain address.
     */
    public Map<String, Object> getAccount(String address) {
        @SuppressWarnings("unchecked")
        Map<String, Object> result = restTemplate.getForObject(
                thorServiceBaseUrl + "/account/" + address,
                Map.class);
        return result;
    }
}
