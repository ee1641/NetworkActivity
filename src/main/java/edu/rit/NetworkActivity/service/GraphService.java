package edu.rit.NetworkActivity.service;

import edu.rit.NetworkActivity.data.entity.Label;
import edu.rit.NetworkActivity.data.entity.Transaction;
import edu.rit.NetworkActivity.data.repository.LabelRepository;
import edu.rit.NetworkActivity.data.repository.TransactionRepository;
import edu.rit.NetworkActivity.service.dto.GraphDataDto;
import edu.rit.NetworkActivity.service.dto.GraphEdgeDto;
import edu.rit.NetworkActivity.service.dto.GraphNodeDto;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

@Service
public class GraphService {

    private final TransactionRepository transactionRepository;
    private final LabelRepository labelRepository;

    public GraphService(TransactionRepository transactionRepository, LabelRepository labelRepository) {
        this.transactionRepository = transactionRepository;
        this.labelRepository = labelRepository;
    }

    public GraphDataDto buildGraph(String address, OffsetDateTime start, OffsetDateTime end, int maxDepth) {
        if (address == null || address.isBlank()) {
            throw new IllegalArgumentException("Address must not be blank");
        }
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end timestamps are required");
        }
        if (!start.isBefore(end)) {
            throw new IllegalArgumentException("Start must be before end");
        }
        if (maxDepth < 1 || maxDepth > 3) {
            throw new IllegalArgumentException("Max depth must be between 1 and 3");
        }

        Map<String, GraphNodeDto> nodeMap = new LinkedHashMap<>();
        List<GraphEdgeDto> edges = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        exploreAddress(address, start, end, maxDepth, 0, nodeMap, edges, visited);

        return new GraphDataDto(new ArrayList<>(nodeMap.values()), edges);
    }

    private void exploreAddress(String address, OffsetDateTime start, OffsetDateTime end,
                                int maxDepth, int currentDepth,
                                Map<String, GraphNodeDto> nodeMap,
                                List<GraphEdgeDto> edges,
                                Set<String> visited) {
        if (currentDepth >= maxDepth || visited.contains(address)) {
            ensureNode(address, nodeMap);
            return;
        }
        visited.add(address);
        ensureNode(address, nodeMap);

        List<Transaction> outgoing = transactionRepository
                .findByFromAddressAndTimestampBetween(address, start, end);
        List<Transaction> incoming = transactionRepository
                .findByToAddressAndTimestampBetween(address, start, end);

        for (Transaction tx : outgoing) {
            if (tx.getToAddress() == null) continue;
            ensureNode(tx.getToAddress(), nodeMap);
            edges.add(toEdge(tx));
            exploreAddress(tx.getToAddress(), start, end, maxDepth, currentDepth + 1,
                    nodeMap, edges, visited);
        }

        for (Transaction tx : incoming) {
            if (tx.getFromAddress() == null) continue;
            ensureNode(tx.getFromAddress(), nodeMap);
            edges.add(toEdge(tx));
            exploreAddress(tx.getFromAddress(), start, end, maxDepth, currentDepth + 1,
                    nodeMap, edges, visited);
        }
    }

    private void ensureNode(String address, Map<String, GraphNodeDto> nodeMap) {
        nodeMap.computeIfAbsent(address, addr -> {
            Optional<Label> label = labelRepository.findByAddress(addr);
            String displayLabel = label.map(Label::getLabelName).orElse(addr);
            String type = label.map(Label::getCategory).orElse("Unknown");
            return new GraphNodeDto(addr, displayLabel, type);
        });
    }

    private GraphEdgeDto toEdge(Transaction tx) {
        return new GraphEdgeDto(
                tx.getFromAddress(),
                tx.getToAddress(),
                tx.getTxHash(),
                tx.getValue()  != null ? tx.getValue().doubleValue()  : 0.0,
                tx.getGasFee() != null ? tx.getGasFee().doubleValue() : 0.0
        );
    }
}
