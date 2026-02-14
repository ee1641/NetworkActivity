package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.VeChainThorClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//http://localhost:8080/api/vechain/status

@RestController
@RequestMapping("/api/vechain")
@CrossOrigin(origins = "*")
public class VeChainController {

    private final VeChainThorClient client;

    public VeChainController(VeChainThorClient client) {
        this.client = client;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return client.getBestBlock();
    }
}
