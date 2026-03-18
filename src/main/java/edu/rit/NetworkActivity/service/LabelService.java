package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.LabelDto;
import edu.rit.NetworkActivity.service.dto.LabelUpsertRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabelService {

    private final LabelRepository labelRepository;

    public LabelService(LabelRepository labelRepository) {
        this.labelRepository = labelRepository;
    }

    public List<LabelDto> getAll(String category) {
        List<Label> labels = (category == null || category.isBlank())
                ? labelRepository.findAll()
                : labelRepository.findByCategory(category);

        return labels.stream().map(this::toDto).collect(Collectors.toList());
    }

    public LabelDto getByAddress(String address) {
        return labelRepository.findByAddress(address)
                .map(this::toDto)
                .orElse(null);
    }

    public LabelDto create(LabelUpsertRequest request) {
        Label label = new Label();
        label.setAddress(request.getAddress());
        label.setTargetAddress(request.getAddress());
        label.setLabelName(request.getLabelName());
        label.setLabelText(request.getLabelName());
        label.setCategory(request.getCategory());
        label.setEntityName(request.getEntityName());
        label.setSource(request.getSource() != null ? request.getSource() : "manual");
        label.setCreatedBy(request.getCreatedBy());
        label.setCreatedAt(OffsetDateTime.now());

        return toDto(labelRepository.save(label));
    }

    public LabelDto update(String address, LabelUpsertRequest request) {
        Label label = labelRepository.findByAddress(address).orElseThrow();

        label.setLabelName(request.getLabelName());
        label.setLabelText(request.getLabelName());
        label.setCategory(request.getCategory());
        label.setEntityName(request.getEntityName());
        label.setSource(request.getSource() != null ? request.getSource() : label.getSource());

        return toDto(labelRepository.save(label));
    }

    public void delete(String address) {
        labelRepository.findByAddress(address).ifPresent(labelRepository::delete);
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