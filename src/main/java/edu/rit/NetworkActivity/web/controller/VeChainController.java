package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.logging.LogEvents;
import edu.rit.NetworkActivity.logging.LogStrategy;
import edu.rit.NetworkActivity.service.VeChainThorClient;
import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vechain")
@CrossOrigin(origins = "*")
public class VeChainController {

    private static final Logger log = LoggerFactory.getLogger(VeChainController.class);
    private final VeChainThorClient client;

    public VeChainController(VeChainThorClient client) {
        this.client = client;
    }

    /** GET /api/vechain/status — current best-block metadata */
    @GetMapping("/status")
    public VeChainSummaryDto status() {
        VeChainSummaryDto dto = client.getSummary();
        LogStrategy.info(log, LogEvents.API_VECHAIN_STATUS,
                "bestBlockNumber", dto != null ? dto.getBestBlockNumber() : "null");
        return dto;
    }

    /** GET /api/vechain/block/{id} — block by number or 0x ID */
    @GetMapping("/block/{id}")
    public ResponseEntity<Map<String, Object>> block(@PathVariable String id) {
        Map<String, Object> block = client.getBlock(id);
        if (block == null) {
            LogStrategy.warn(log, LogEvents.API_VECHAIN_NOT_FOUND, "type", "block", "id", id);
            return ResponseEntity.notFound().build();
        }
        LogStrategy.info(log, LogEvents.API_VECHAIN_BLOCK, "id", id);
        return ResponseEntity.ok(block);
    }

    /** GET /api/vechain/tx/{id} — transaction by 0x-prefixed ID */
    @GetMapping("/tx/{id}")
    public ResponseEntity<Map<String, Object>> transaction(@PathVariable String id) {
        Map<String, Object> tx = client.getTransaction(id);
        if (tx == null) {
            LogStrategy.warn(log, LogEvents.API_VECHAIN_NOT_FOUND, "type", "tx", "id", id);
            return ResponseEntity.notFound().build();
        }
        LogStrategy.info(log, LogEvents.API_VECHAIN_TX, "id", id);
        return ResponseEntity.ok(tx);
    }

    /** GET /api/vechain/account/{address} — VET/VTHO balance */
    @GetMapping("/account/{address}")
    public Map<String, Object> account(@PathVariable String address) {
        Map<String, Object> result = client.getAccount(address);
        LogStrategy.info(log, LogEvents.API_VECHAIN_ACCOUNT, "address", address);
        return result;
    }
}
