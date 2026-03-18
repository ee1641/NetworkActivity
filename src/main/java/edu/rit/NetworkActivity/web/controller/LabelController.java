package edu.rit.NetworkActivity.web.controller;

import edu.rit.NetworkActivity.service.LabelService;
import edu.rit.NetworkActivity.service.dto.LabelDto;
import edu.rit.NetworkActivity.service.dto.LabelUpsertRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//http://localhost:8080/api/labels
@RequestMapping("/api/labels")
@CrossOrigin(origins = "*")
public class LabelController {

    private final LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    @GetMapping
    public List<LabelDto> getAll(@RequestParam(required = false) String category) {
        return labelService.getAll(category);
    }

    @GetMapping("/{address}")
    public ResponseEntity<LabelDto> getByAddress(@PathVariable String address) {
        LabelDto dto = labelService.getByAddress(address);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<LabelDto> create(@RequestBody LabelUpsertRequest request) {
        return ResponseEntity.ok(labelService.create(request));
    }

    @PutMapping("/{address}")
    public ResponseEntity<LabelDto> update(@PathVariable String address, @RequestBody LabelUpsertRequest request) {
        return ResponseEntity.ok(labelService.update(address, request));
    }

    @DeleteMapping("/{address}")
    public ResponseEntity<Void> delete(@PathVariable String address) {
        labelService.delete(address);
        return ResponseEntity.noContent().build();
    }
}