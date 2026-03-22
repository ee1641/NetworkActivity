package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.service.dto.SearchResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock AddressRepository addressRepository;
    @Mock LabelRepository labelRepository;
    @InjectMocks SearchService searchService;

    @ParameterizedTest
    @CsvSource({
        "'0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a0', ADDRESS",
        "'742d35Cc6634C0532925a3b844Bc9e7595f3f8a0',   ADDRESS",
        "'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', HASH_64",
        "'1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', HASH_64",
        "'12345',       BLOCK_NUMBER",
        "'0',           BLOCK_NUMBER",
        "'hello world', TEXT",
        "'My Wallet',   TEXT"
    })
    void detectType_classifiesCorrectly(String query, String expectedType) {
        SearchResponseDto response = searchService.search(query.trim());
        assertEquals(expectedType, response.getDetectedType());
    }

    @Test
    void search_nullQuery_returnsEmptyDetectedType() {
        SearchResponseDto response = searchService.search(null);

        assertEquals("EMPTY", response.getDetectedType());
        assertNotNull(response.getResults());
        assertTrue(response.getResults().getAddresses().isEmpty());
        assertTrue(response.getResults().getLabels().isEmpty());
    }

    @Test
    void search_blankQuery_returnsEmptyResults() {
        SearchResponseDto response = searchService.search("   ");

        assertEquals("EMPTY", response.getDetectedType());
        assertTrue(response.getResults().getAddresses().isEmpty());
    }

    @Test
    void search_addressType_findsAddressAndLabel() {
        String hex40 = "742d35Cc6634C0532925a3b844Bc9e7595f3f8a0";
        String query = "0x" + hex40;

        Address address = new Address();
        address.setId(1L);
        address.setAddress(query);
        address.setType("wallet");
        address.setBalance(100.0f);
        address.setRiskScore(0.5f);

        Label label = new Label();
        label.setId(2L);
        label.setAddress(query);
        label.setLabelName("Test Wallet");
        label.setCategory("Wallet");
        label.setEntityName("TestOrg");
        label.setSource("manual");

        when(addressRepository.findByAddressIgnoreCase(query)).thenReturn(Optional.of(address));
        when(labelRepository.findByAddressIgnoreCase(query)).thenReturn(Optional.of(label));

        SearchResponseDto response = searchService.search(query);

        assertEquals("ADDRESS", response.getDetectedType());
        assertEquals(1, response.getResults().getAddresses().size());
        assertEquals(query, response.getResults().getAddresses().get(0).getAddress());
        assertEquals(1, response.getResults().getLabels().size());
        assertEquals("Test Wallet", response.getResults().getLabels().get(0).getLabelName());
    }

    @Test
    void search_addressType_noMatchesReturnsEmptyLists() {
        String hex40 = "742d35Cc6634C0532925a3b844Bc9e7595f3f8a0";
        String query = "0x" + hex40;

        when(addressRepository.findByAddressIgnoreCase(query)).thenReturn(Optional.empty());
        when(labelRepository.findByAddressIgnoreCase(query)).thenReturn(Optional.empty());

        SearchResponseDto response = searchService.search(query);

        assertEquals("ADDRESS", response.getDetectedType());
        assertTrue(response.getResults().getAddresses().isEmpty());
        assertTrue(response.getResults().getLabels().isEmpty());
    }

    @Test
    void search_textType_findsLabelsAndAddresses() {
        String query = "exchange";

        Label label = new Label();
        label.setId(1L);
        label.setAddress("0xABC");
        label.setLabelName("Big Exchange");
        label.setCategory("Exchange");
        label.setEntityName("ExchangeCorp");
        label.setSource("api");

        Address address = new Address();
        address.setId(2L);
        address.setAddress("0xDEF");
        address.setType("exchange");

        when(labelRepository.searchLabels(query)).thenReturn(List.of(label));
        when(addressRepository.searchAddresses(query)).thenReturn(List.of(address));

        SearchResponseDto response = searchService.search(query);

        assertEquals("TEXT", response.getDetectedType());
        assertEquals(1, response.getResults().getLabels().size());
        assertEquals("Big Exchange", response.getResults().getLabels().get(0).getLabelName());
        assertEquals(1, response.getResults().getAddresses().size());
        assertEquals("0xDEF", response.getResults().getAddresses().get(0).getAddress());
    }

    @Test
    void search_hash64_returnsEmptyResultsForUnimplementedLookup() {
        String hash64 = "ABCDEFabcdef1234567890123456789012345678901234567890123456789012";

        SearchResponseDto response = searchService.search(hash64);

        assertEquals("HASH_64", response.getDetectedType());
        assertNotNull(response.getResults());
        assertTrue(response.getResults().getAddresses().isEmpty());
        assertTrue(response.getResults().getLabels().isEmpty());
    }

    @Test
    void search_blockNumber_returnsEmptyResultsForUnimplementedLookup() {
        SearchResponseDto response = searchService.search("99999");

        assertEquals("BLOCK_NUMBER", response.getDetectedType());
        assertNotNull(response.getResults());
        assertTrue(response.getResults().getAddresses().isEmpty());
    }

    @Test
    void search_preservesOriginalQueryInResponse() {
        String query = "  some query  ";
        SearchResponseDto response = searchService.search(query);

        assertEquals("some query", response.getQuery());
    }
}
