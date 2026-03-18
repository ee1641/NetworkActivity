package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.LabelDto;
import edu.rit.NetworkActivity.service.dto.LabelUpsertRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class LabelService {

    private final LabelRepository labelRepository;

    public LabelService(LabelRepository labelRepository) {
        this.labelRepository = labelRepository;
    }

    public List<LabelDto> getAll(String category, String entityName, String source, String address) {
        return labelRepository.findAll().stream()
                .filter(label -> matchesEqualsIgnoreCase(label.getCategory(), category))
                .filter(label -> matchesContainsIgnoreCase(label.getEntityName(), entityName))
                .filter(label -> matchesEqualsIgnoreCase(label.getSource(), source))
                .filter(label -> matchesEqualsIgnoreCase(label.getAddress(), address))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LabelDto getByAddress(String address) {
        return labelRepository.findByAddressIgnoreCase(address)
                .map(this::toDto)
                .orElse(null);
    }

    public LabelDto create(LabelUpsertRequest request) {
        Label label = new Label();
        label.setAddress(normalizeNullable(request.getAddress()));
        label.setTargetAddress(normalizeNullable(request.getAddress()));
        label.setLabelName(normalizeNullable(request.getLabelName()));
        label.setLabelText(normalizeNullable(request.getLabelName()));
        label.setCategory(normalizeNullable(request.getCategory()));
        label.setEntityName(normalizeNullable(request.getEntityName()));
        label.setSource(normalizeNullable(request.getSource()) != null ? normalizeNullable(request.getSource()) : "manual");
        label.setCreatedBy(normalizeNullable(request.getCreatedBy()));
        label.setCreatedAt(OffsetDateTime.now());

        return toDto(labelRepository.save(label));
    }

    public LabelDto update(String address, LabelUpsertRequest request) {
        Label label = labelRepository.findByAddressIgnoreCase(address).orElseThrow();

        label.setLabelName(normalizeNullable(request.getLabelName()));
        label.setLabelText(normalizeNullable(request.getLabelName()));
        label.setCategory(normalizeNullable(request.getCategory()));
        label.setEntityName(normalizeNullable(request.getEntityName()));

        String normalizedSource = normalizeNullable(request.getSource());
        label.setSource(normalizedSource != null ? normalizedSource : label.getSource());

        return toDto(labelRepository.save(label));
    }

    public void delete(String address) {
        labelRepository.findByAddressIgnoreCase(address).ifPresent(labelRepository::delete);
    }

    private boolean matchesEqualsIgnoreCase(String actual, String filter) {
        if (filter == null || filter.isBlank()) return true;
        if (actual == null) return false;
        return actual.trim().equalsIgnoreCase(filter.trim());
    }

    private boolean matchesContainsIgnoreCase(String actual, String filter) {
        if (filter == null || filter.isBlank()) return true;
        if (actual == null) return false;
        return actual.toLowerCase(Locale.ROOT).contains(filter.trim().toLowerCase(Locale.ROOT));
    }

    private String normalizeNullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private LabelDto toDto(Label label) {
        LabelDto dto = new LabelDto();
        dto.setId(label.getId());
        dto.setAddress(label.getAddress());
        dto.setLabelName(label.getLabelName());
        dto.setCategory(label.getCategory());
        dto.setEntityName(label.getEntityName());
        dto.setSource(label.getSource());
        dto.setCreatedAt(label.getCreatedAt());
        dto.setCreatedBy(label.getCreatedBy());
        return dto;
    }
}