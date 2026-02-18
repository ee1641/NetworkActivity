package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.VeChainThorClient;
import edu.rit.NetworkActivity.service.dto.VeChainSummaryDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vechain")
@CrossOrigin(origins = "*")
public class VeChainController {

    private final VeChainThorClient client;

    public VeChainController(VeChainThorClient client) {
        this.client = client;
    }

    @GetMapping("/status")
    public VeChainSummaryDto status() {
        return client.getSummary();
    }
}
