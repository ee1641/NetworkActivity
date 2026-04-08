package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.entity.LabelHistory;
import edu.rit.NetworkActivity.data.repository.LabelHistoryRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.LabelDto;
import edu.rit.NetworkActivity.service.dto.LabelHistoryDto;
import edu.rit.NetworkActivity.service.dto.LabelUpsertRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class LabelService {

    private final LabelRepository labelRepository;
    private final LabelHistoryRepository labelHistoryRepository;

    public LabelService(LabelRepository labelRepository,
                        LabelHistoryRepository labelHistoryRepository) {
        this.labelRepository = labelRepository;
        this.labelHistoryRepository = labelHistoryRepository;
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

    public List<LabelHistoryDto> getHistory() {
        return labelHistoryRepository.findAllByOrderByChangedAtDesc().stream()
                .map(this::toHistoryDto)
                .collect(Collectors.toList());
    }

    public List<LabelHistoryDto> getHistoryByAddress(String address) {
        return labelHistoryRepository.findByAddressIgnoreCaseOrderByChangedAtDesc(address).stream()
                .map(this::toHistoryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LabelDto create(LabelUpsertRequest request) {
        String normalizedAddress = normalizeNullable(request.getAddress());
        if (normalizedAddress == null) {
            throw new IllegalArgumentException("Address is required.");
        }

        if (labelRepository.findByAddressIgnoreCase(normalizedAddress).isPresent()) {
            throw new IllegalArgumentException("A label already exists for this address.");
        }

        String normalizedLabelName = normalizeNullable(request.getLabelName());
        if (normalizedLabelName == null) {
            throw new IllegalArgumentException("Label name is required.");
        }

        String normalizedCategory = normalizeNullable(request.getCategory());
        if (normalizedCategory == null) {
            throw new IllegalArgumentException("Category is required.");
        }

        String changedBy = normalizeNullable(request.getCreatedBy()) != null
                ? normalizeNullable(request.getCreatedBy())
                : "system";

        Label label = new Label();
        label.setAddress(normalizedAddress);
        label.setTargetAddress(normalizedAddress);
        label.setLabelName(normalizedLabelName);
        label.setLabelText(normalizedLabelName);
        label.setCategory(normalizedCategory);
        label.setEntityName(normalizeNullable(request.getEntityName()));
        label.setSource(normalizeNullable(request.getSource()) != null ? normalizeNullable(request.getSource()) : "manual");
        label.setCreatedBy(changedBy);
        label.setCreatedAt(OffsetDateTime.now());

        Label saved = labelRepository.save(label);

        saveHistory(
                saved.getId(),
                saved.getAddress(),
                "CREATED",
                null,
                saved.getLabelName(),
                changedBy
        );

        return toDto(saved);
    }

    @Transactional
    public LabelDto update(String address, LabelUpsertRequest request) {
        Label label = labelRepository.findByAddressIgnoreCase(address)
                .orElseThrow(() -> new IllegalArgumentException("Label not found for address: " + address));

        String oldValue = label.getLabelName();

        String normalizedLabelName = normalizeNullable(request.getLabelName());
        if (normalizedLabelName == null) {
            throw new IllegalArgumentException("Label name is required.");
        }

        String normalizedCategory = normalizeNullable(request.getCategory());
        if (normalizedCategory == null) {
            throw new IllegalArgumentException("Category is required.");
        }

        label.setLabelName(normalizedLabelName);
        label.setLabelText(normalizedLabelName);
        label.setCategory(normalizedCategory);
        label.setEntityName(normalizeNullable(request.getEntityName()));

        String normalizedSource = normalizeNullable(request.getSource());
        if (normalizedSource != null) {
            label.setSource(normalizedSource);
        }

        Label saved = labelRepository.save(label);

        String changedBy = normalizeNullable(request.getCreatedBy()) != null
                ? normalizeNullable(request.getCreatedBy())
                : "system";

        saveHistory(
                saved.getId(),
                saved.getAddress(),
                "UPDATED",
                oldValue,
                saved.getLabelName(),
                changedBy
        );

        return toDto(saved);
    }

    @Transactional
    public void delete(String address) {
        Label label = labelRepository.findByAddressIgnoreCase(address).orElse(null);
        if (label == null) {
            return;
        }

        String changedBy = label.getCreatedBy() != null ? label.getCreatedBy() : "system";

        saveHistory(
                label.getId(),
                label.getAddress(),
                "DELETED",
                label.getLabelName(),
                null,
                changedBy
        );

        labelRepository.delete(label);
    }

    private void saveHistory(Long labelId,
                             String address,
                             String action,
                             String oldValue,
                             String newValue,
                             String changedBy) {
        LabelHistory history = new LabelHistory();
        history.setLabelId(labelId);
        history.setAddress(address);
        history.setAction(action);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setChangedAt(OffsetDateTime.now());
        history.setChangedBy(changedBy != null ? changedBy : "system");
        labelHistoryRepository.save(history);
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

    private LabelHistoryDto toHistoryDto(LabelHistory history) {
        LabelHistoryDto dto = new LabelHistoryDto();
        dto.setId(history.getId());
        dto.setLabelId(history.getLabelId());
        dto.setAddress(history.getAddress());
        dto.setAction(history.getAction());
        dto.setChangedAt(history.getChangedAt());
        dto.setChangedBy(history.getChangedBy());
        dto.setOldValue(history.getOldValue());
        dto.setNewValue(history.getNewValue());
        return dto;
    }
}