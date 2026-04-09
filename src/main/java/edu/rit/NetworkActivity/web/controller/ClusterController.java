package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.ClusterService;
import edu.rit.NetworkActivity.service.dto.ClusterDto;
import edu.rit.NetworkActivity.service.dto.ClusterCreateRequest;
import edu.rit.NetworkActivity.service.dto.ClusterEventDto;
import edu.rit.NetworkActivity.service.dto.ClusterMergeRequest;
import edu.rit.NetworkActivity.service.dto.ClusterUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clusters")
@CrossOrigin(origins = "*")
public class ClusterController {

    private final ClusterService clusterService;

    public ClusterController(ClusterService clusterService) {
        this.clusterService = clusterService;
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

    @PostMapping("/merge")
    public ResponseEntity<ClusterDto> merge(@RequestBody ClusterMergeRequest request) {
        ClusterDto dto = clusterService.merge(request);
        if (dto == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(dto);
    }
}

