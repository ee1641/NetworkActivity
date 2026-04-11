package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.ClusterService;
import edu.rit.NetworkActivity.service.ClusterWalletService;
import edu.rit.NetworkActivity.service.dto.ClusterDto;
import edu.rit.NetworkActivity.service.dto.ClusterAddWalletRequest;
import edu.rit.NetworkActivity.service.dto.ClusterCreateRequest;
import edu.rit.NetworkActivity.service.dto.ClusterEventDto;
import edu.rit.NetworkActivity.service.dto.ClusterMergeRequest;
import edu.rit.NetworkActivity.service.dto.ClusterUpdateRequest;
import edu.rit.NetworkActivity.service.dto.ClusterWalletDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clusters")
@CrossOrigin(origins = "*")
public class ClusterController {

    private final ClusterService clusterService;
    private final ClusterWalletService clusterWalletService;

    public ClusterController(ClusterService clusterService, ClusterWalletService clusterWalletService) {
        this.clusterService = clusterService;
        this.clusterWalletService = clusterWalletService;
    }

    @GetMapping
    public List<ClusterDto> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String sortBy
    ) {
        return clusterService.list(search, entityType, sortBy);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClusterDto> get(@PathVariable Long id) {
        ClusterDto dto = clusterService.get(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<ClusterDto> create(@RequestBody ClusterCreateRequest request) {
        return ResponseEntity.ok(clusterService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClusterDto> update(@PathVariable Long id, @RequestBody ClusterUpdateRequest request) {
        ClusterDto dto = clusterService.update(id, request);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<ClusterEventDto>> events(@PathVariable Long id) {
        // Return empty list for missing cluster to keep UI simple
        if (clusterService.get(id) == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(clusterService.events(id));
    }

    @GetMapping("/{id}/wallets")
    public ResponseEntity<List<ClusterWalletDto>> listWallets(@PathVariable Long id) {
        if (clusterService.get(id) == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(clusterWalletService.listWalletsForCluster(id));
    }

    @PostMapping("/merge")
    public ResponseEntity<ClusterDto> merge(@RequestBody ClusterMergeRequest request) {
        ClusterDto dto = clusterService.merge(request);
        if (dto == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/wallets")
    public ResponseEntity<Void> addWallet(@PathVariable Long id, @RequestBody ClusterAddWalletRequest request) {
        try {
            clusterWalletService.addWalletToCluster(id, request == null ? null : request.getAddress());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}/wallets/{walletId}")
    public ResponseEntity<Void> removeWallet(@PathVariable Long id, @PathVariable Long walletId) {
        if (clusterService.get(id) == null) return ResponseEntity.notFound().build();
        try {
            boolean removed = clusterWalletService.removeWalletFromCluster(id, walletId);
            return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (clusterService.get(id) == null) return ResponseEntity.notFound().build();
        clusterWalletService.deleteAllWalletLinksForCluster(id);
        boolean ok = clusterService.delete(id);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

