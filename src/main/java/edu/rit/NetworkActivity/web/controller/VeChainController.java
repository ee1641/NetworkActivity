package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.VeChainThorClient;
import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vechain")
@CrossOrigin(origins = "*")
public class VeChainController {

    private final VeChainThorClient client;

    public VeChainController(VeChainThorClient client) {
        this.client = client;
    }

    /** GET /api/vechain/status — current best-block metadata */
    @GetMapping("/status")
    public VeChainSummaryDto status() {
        return client.getSummary();
    }

    /**
     * GET /api/vechain/block/{id}
     * Look up a block by its number (e.g. 18547892) or block ID (0x…).
     */
    @GetMapping("/block/{id}")
    public ResponseEntity<Map<String, Object>> block(@PathVariable String id) {
        Map<String, Object> block = client.getBlock(id);
        if (block == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(block);
    }

    /**
     * GET /api/vechain/tx/{id}
     * Look up a transaction by its 0x-prefixed transaction ID.
     */
    @GetMapping("/tx/{id}")
    public ResponseEntity<Map<String, Object>> transaction(@PathVariable String id) {
        Map<String, Object> tx = client.getTransaction(id);
        if (tx == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tx);
    }

    /**
     * GET /api/vechain/account/{address}
     * Returns VET balance, VTHO energy, and contract flag for the given address.
     */
    @GetMapping("/account/{address}")
    public Map<String, Object> account(@PathVariable String address) {
        return client.getAccount(address);
    }
}
