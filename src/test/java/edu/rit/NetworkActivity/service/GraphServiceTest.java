package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.service.dto.GraphDataDto;
import edu.rit.NetworkActivity.service.dto.GraphEdgeDto;
import edu.rit.NetworkActivity.service.dto.GraphNodeDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GraphServiceTest {

    @Mock TransactionRepository transactionRepository;
    @Mock LabelRepository labelRepository;
    @InjectMocks GraphService graphService;

    private static final OffsetDateTime START = OffsetDateTime.of(2025, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
    private static final OffsetDateTime END   = OffsetDateTime.of(2025, 1, 2, 0, 0, 0, 0, ZoneOffset.UTC);

    private Transaction tx(Long id, String from, String to, Float value, Float gas, String hash) {
        Transaction tx = new Transaction();
        tx.setId(id);
        tx.setFromAddress(from);
        tx.setToAddress(to);
        tx.setValue(value);
        tx.setGasFee(gas);
        tx.setTxHash(hash);
        tx.setTimestamp(START.plusHours(id));
        return tx;
    }

    @Test
    void buildGraph_singleDepth_createsNodesAndEdges() {
        Transaction t1 = tx(1L, "0xROOT", "0xA", 10.0f, 0.5f, "0xH1");
        Transaction t2 = tx(2L, "0xB", "0xROOT", 5.0f, 0.2f, "0xH2");

        when(transactionRepository.findByFromAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of(t1));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of(t2));
        when(transactionRepository.findByFromAddressAndTimestampBetween(eq("0xA"), any(), any()))
                .thenReturn(List.of());
        when(transactionRepository.findByToAddressAndTimestampBetween(eq("0xA"), any(), any()))
                .thenReturn(List.of());
        when(transactionRepository.findByFromAddressAndTimestampBetween(eq("0xB"), any(), any()))
                .thenReturn(List.of());
        when(transactionRepository.findByToAddressAndTimestampBetween(eq("0xB"), any(), any()))
                .thenReturn(List.of());
        when(labelRepository.findByAddress(anyString())).thenReturn(Optional.empty());

        GraphDataDto graph = graphService.buildGraph("0xROOT", START, END, 2);

        assertEquals(3, graph.getNodes().size());
        assertEquals(2, graph.getEdges().size());

        assertTrue(graph.getNodes().stream().anyMatch(n -> n.getId().equals("0xROOT")));
        assertTrue(graph.getNodes().stream().anyMatch(n -> n.getId().equals("0xA")));
        assertTrue(graph.getNodes().stream().anyMatch(n -> n.getId().equals("0xB")));
    }

    @Test
    void buildGraph_edgeValues_mappedCorrectly() {
        Transaction t1 = tx(1L, "0xROOT", "0xA", 42.5f, 1.2f, "0xTXHASH");

        when(transactionRepository.findByFromAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of(t1));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of());
        when(labelRepository.findByAddress(anyString())).thenReturn(Optional.empty());

        GraphDataDto graph = graphService.buildGraph("0xROOT", START, END, 1);

        GraphEdgeDto edge = graph.getEdges().get(0);
        assertEquals("0xROOT", edge.getSource());
        assertEquals("0xA", edge.getTarget());
        assertEquals("0xTXHASH", edge.getTxHash());
        assertEquals(42.5, edge.getValue(), 0.01);
        assertEquals(1.2, edge.getGasFee(), 0.01);
    }

    @Test
    void buildGraph_enrichesNodesWithLabels() {
        Transaction t1 = tx(1L, "0xROOT", "0xLABELED", 10.0f, 0.5f, "0xH1");

        Label label = new Label();
        label.setLabelName("My Exchange");
        label.setCategory("Exchange");

        when(transactionRepository.findByFromAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of(t1));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of());
        when(labelRepository.findByAddress("0xROOT")).thenReturn(Optional.empty());
        when(labelRepository.findByAddress("0xLABELED")).thenReturn(Optional.of(label));

        GraphDataDto graph = graphService.buildGraph("0xROOT", START, END, 1);

        GraphNodeDto labeledNode = graph.getNodes().stream()
                .filter(n -> n.getId().equals("0xLABELED"))
                .findFirst().orElseThrow();

        assertEquals("My Exchange", labeledNode.getLabel());
        assertEquals("Exchange", labeledNode.getType());
    }

    @Test
    void buildGraph_blankAddress_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph("", START, END, 1));
    }

    @Test
    void buildGraph_nullAddress_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph(null, START, END, 1));
    }

    @Test
    void buildGraph_startAfterEnd_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph("0xROOT", END, START, 1));
    }

    @Test
    void buildGraph_depthZero_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph("0xROOT", START, END, 0));
    }

    @Test
    void buildGraph_depthFour_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph("0xROOT", START, END, 4));
    }

    @Test
    void buildGraph_nullTimestamps_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> graphService.buildGraph("0xROOT", null, END, 1));
    }

    @Test
    void buildGraph_noCycles_explorationStopsAtVisited() {
        Transaction t1 = tx(1L, "0xA", "0xB", 10.0f, 0.1f, "0xH1");
        Transaction t2 = tx(2L, "0xB", "0xA", 5.0f, 0.1f, "0xH2");

        when(transactionRepository.findByFromAddressAndTimestampBetween("0xA", START, END))
                .thenReturn(List.of(t1));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xA", START, END))
                .thenReturn(List.of(t2));
        when(transactionRepository.findByFromAddressAndTimestampBetween("0xB", START, END))
                .thenReturn(List.of(t2));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xB", START, END))
                .thenReturn(List.of(t1));
        when(labelRepository.findByAddress(anyString())).thenReturn(Optional.empty());

        GraphDataDto graph = graphService.buildGraph("0xA", START, END, 3);

        assertEquals(2, graph.getNodes().size());
    }

    @Test
    void buildGraph_nullTransactionValue_defaultsToZero() {
        Transaction t1 = tx(1L, "0xROOT", "0xA", null, null, "0xH1");

        when(transactionRepository.findByFromAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of(t1));
        when(transactionRepository.findByToAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of());
        when(labelRepository.findByAddress(anyString())).thenReturn(Optional.empty());

        GraphDataDto graph = graphService.buildGraph("0xROOT", START, END, 1);

        assertEquals(0.0, graph.getEdges().get(0).getValue(), 0.01);
        assertEquals(0.0, graph.getEdges().get(0).getGasFee(), 0.01);
    }

    @Test
    void buildGraph_noTransactions_returnsRootNodeOnly() {
        when(transactionRepository.findByFromAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of());
        when(transactionRepository.findByToAddressAndTimestampBetween("0xROOT", START, END))
                .thenReturn(List.of());
        when(labelRepository.findByAddress("0xROOT")).thenReturn(Optional.empty());

        GraphDataDto graph = graphService.buildGraph("0xROOT", START, END, 1);

        assertEquals(1, graph.getNodes().size());
        assertEquals("0xROOT", graph.getNodes().get(0).getId());
        assertTrue(graph.getEdges().isEmpty());
    }
}
