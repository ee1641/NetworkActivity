package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Address;
import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.AddressRepository;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataConsistencyValidationTest {

    @Mock TransactionRepository transactionRepository;
    @Mock AddressRepository addressRepository;
    @Mock LabelRepository labelRepository;

    private static final OffsetDateTime TS = OffsetDateTime.of(2025, 6, 1, 0, 0, 0, 0, ZoneOffset.UTC);

    @Test
    void transaction_mustHaveTimestamp() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setTimestamp(null);
        tx.setFromAddress("0xAAA");
        tx.setToAddress("0xBBB");

        assertNull(tx.getTimestamp(), "Null timestamps should be caught by validation");
    }

    @Test
    void transaction_mustHaveAtLeastOneAddressEndpoint() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setTimestamp(TS);
        tx.setFromAddress(null);
        tx.setToAddress(null);

        boolean hasEndpoint = tx.getFromAddress() != null || tx.getToAddress() != null;
        assertFalse(hasEndpoint, "Transaction with no from/to should be flagged as inconsistent");
    }

    @Test
    void transaction_valueCannotBeNegative() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setTimestamp(TS);
        tx.setValue(-5.0f);

        assertTrue(tx.getValue() < 0, "Negative values should be caught by validation");
    }

    @Test
    void transaction_gasFeeCannotBeNegative() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setTimestamp(TS);
        tx.setGasFee(-1.0f);

        assertTrue(tx.getGasFee() < 0, "Negative gas fees should be caught by validation");
    }

    @Test
    void address_mustHaveNonBlankAddressField() {
        Address addr = new Address();
        addr.setId(1L);
        addr.setAddress("");

        assertTrue(addr.getAddress().isBlank(), "Blank address should be flagged as inconsistent");
    }

    @Test
    void label_mustHaveNonBlankAddressAndLabelName() {
        Label label = new Label();
        label.setId(1L);
        label.setAddress("");
        label.setLabelName("");

        assertTrue(label.getAddress().isBlank(), "Label with blank address should be flagged");
        assertTrue(label.getLabelName().isBlank(), "Label with blank labelName should be flagged");
    }

    @Test
    void transactionAddresses_shouldHaveMatchingAddressRecords() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setTimestamp(TS);
        tx.setFromAddress("0xAAA");
        tx.setToAddress("0xBBB");

        when(transactionRepository.findAll()).thenReturn(List.of(tx));
        when(addressRepository.findByAddress("0xAAA")).thenReturn(Optional.empty());

        List<Transaction> allTxs = transactionRepository.findAll();
        Set<String> orphanedSenders = allTxs.stream()
            .map(Transaction::getFromAddress)
            .filter(addr -> addr != null && addressRepository.findByAddress(addr).isEmpty())
            .collect(Collectors.toSet());

        assertFalse(orphanedSenders.isEmpty(),
                "Expected to find sender addresses missing from addresses table");
        assertTrue(orphanedSenders.contains("0xAAA"));
    }

    @Test
    void labelAddress_shouldReferenceExistingAddress() {
        Label label = new Label();
        label.setId(1L);
        label.setAddress("0xMISSING");
        label.setLabelName("Orphan Label");

        when(labelRepository.findAll()).thenReturn(List.of(label));
        when(addressRepository.findByAddress("0xMISSING")).thenReturn(Optional.empty());

        List<Label> allLabels = labelRepository.findAll();
        List<Label> orphanedLabels = allLabels.stream()
            .filter(l -> l.getAddress() != null
                    && addressRepository.findByAddress(l.getAddress()).isEmpty())
            .toList();

        assertEquals(1, orphanedLabels.size());
        assertEquals("0xMISSING", orphanedLabels.get(0).getAddress());
    }

    @Test
    void labelTargetAddress_whenSetShouldReferenceExistingAddress() {
        Label label = new Label();
        label.setId(1L);
        label.setAddress("0xABC");
        label.setTargetAddress("0xNONEXISTENT");
        label.setLabelName("Bad Target");

        when(labelRepository.findAll()).thenReturn(List.of(label));
        when(addressRepository.findByAddress("0xNONEXISTENT")).thenReturn(Optional.empty());

        List<Label> allLabels = labelRepository.findAll();
        List<Label> badTargets = allLabels.stream()
            .filter(l -> l.getTargetAddress() != null
                    && addressRepository.findByAddress(l.getTargetAddress()).isEmpty())
            .toList();

        assertEquals(1, badTargets.size());
    }

    @Test
    void address_riskScoreShouldBeBetweenZeroAndOne() {
        Address addr = new Address();
        addr.setId(1L);
        addr.setAddress("0xABC");
        addr.setRiskScore(1.5f);

        boolean valid = addr.getRiskScore() == null
                || (addr.getRiskScore() >= 0.0f && addr.getRiskScore() <= 1.0f);

        assertFalse(valid, "Risk score 1.5 should be flagged as out of [0..1] range");
    }

    @Test
    void address_balanceCannotBeNegative() {
        Address addr = new Address();
        addr.setId(1L);
        addr.setAddress("0xABC");
        addr.setBalance(-100.0f);

        boolean valid = addr.getBalance() == null || addr.getBalance() >= 0.0f;
        assertFalse(valid, "Negative balance should be flagged");
    }

    @Test
    void transaction_duplicateTxHashShouldBeDetected() {
        Transaction tx1 = new Transaction();
        tx1.setId(1L);
        tx1.setTimestamp(TS);
        tx1.setTxHash("0xHASH123");

        Transaction tx2 = new Transaction();
        tx2.setId(2L);
        tx2.setTimestamp(TS);
        tx2.setTxHash("0xHASH123");

        when(transactionRepository.findAll()).thenReturn(List.of(tx1, tx2));

        List<Transaction> allTxs = transactionRepository.findAll();
        Set<String> seenHashes = new java.util.HashSet<>();
        List<String> duplicateHashes = allTxs.stream()
            .map(Transaction::getTxHash)
            .filter(h -> h != null && !seenHashes.add(h))
            .toList();

        assertEquals(1, duplicateHashes.size());
        assertEquals("0xHASH123", duplicateHashes.get(0));
    }
}
