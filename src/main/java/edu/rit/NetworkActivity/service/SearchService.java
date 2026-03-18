package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.SearchAddressResultDto;
import edu.rit.NetworkActivity.service.dto.SearchLabelResultDto;
import edu.rit.NetworkActivity.service.dto.SearchResponseDto;
import edu.rit.NetworkActivity.service.dto.SearchResultsDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private final AddressRepository addressRepository;
    private final LabelRepository labelRepository;

    public SearchService(AddressRepository addressRepository, LabelRepository labelRepository) {
        this.addressRepository = addressRepository;
        this.labelRepository = labelRepository;
    }

    public SearchResponseDto search(String rawQuery) {
        String query = rawQuery == null ? "" : rawQuery.trim();

        SearchResponseDto response = new SearchResponseDto();
        response.setQuery(query);
        response.setDetectedType(detectType(query));

        SearchResultsDto results = new SearchResultsDto();

        if (query.isBlank()) {
            response.setResults(results);
            return response;
        }

        switch (response.getDetectedType()) {
            case "ADDRESS" -> {
                addressRepository.findByAddressIgnoreCase(query)
                        .map(this::toAddressDto)
                        .ifPresent(a -> results.getAddresses().add(a));

                labelRepository.findByAddressIgnoreCase(query)
                        .map(this::toLabelDto)
                        .ifPresent(l -> results.getLabels().add(l));
            }

            case "HASH_64" -> {
                // transactions and blocks not implemented yet
                // keep response shape stable for later
            }

            case "BLOCK_NUMBER" -> {
                // block lookup not implemented yet
            }

            case "TEXT" -> {
                List<SearchLabelResultDto> labelMatches = labelRepository.searchLabels(query).stream()
                        .map(this::toLabelDto)
                        .toList();

                List<SearchAddressResultDto> addressMatches = addressRepository.searchAddresses(query).stream()
                        .map(this::toAddressDto)
                        .toList();

                results.getLabels().addAll(labelMatches);
                results.getAddresses().addAll(addressMatches);
            }
        }

        response.setResults(results);
        return response;
    }

    private String detectType(String query) {
        if (query == null || query.isBlank()) {
            return "EMPTY";
        }

        String normalized = query.startsWith("0x") || query.startsWith("0X")
                ? query.substring(2)
                : query;

        if (normalized.matches("^[0-9]+$")) {
            return "BLOCK_NUMBER";
        }

        if (normalized.matches("^[a-fA-F0-9]{40}$")) {
            return "ADDRESS";
        }

        if (normalized.matches("^[a-fA-F0-9]{64}$")) {
            return "HASH_64";
        }

        return "TEXT";
    }

    private SearchAddressResultDto toAddressDto(Address address) {
        SearchAddressResultDto dto = new SearchAddressResultDto();
        dto.setId(address.getId());
        dto.setAddress(address.getAddress());
        dto.setType(address.getType());
        dto.setBalance(address.getBalance());
        dto.setRiskScore(address.getRiskScore());
        return dto;
    }

    private SearchLabelResultDto toLabelDto(Label label) {
        SearchLabelResultDto dto = new SearchLabelResultDto();
        dto.setId(label.getId());
        dto.setAddress(label.getAddress());
        dto.setLabelName(label.getLabelName());
        dto.setCategory(label.getCategory());
        dto.setEntityName(label.getEntityName());
        dto.setSource(label.getSource());
        return dto;
    }
}