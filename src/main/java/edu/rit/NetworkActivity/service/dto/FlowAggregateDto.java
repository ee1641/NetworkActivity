package edu.rit.NetworkActivity.service.dto;

import java.util.List;
import java.util.Map;

public class FlowAggregateDto {
    private long transactionCount;
    private double totalTransferredValue;
    private double totalGasFees;
    private long uniqueSenders;
    private long uniqueReceivers;
    private List<Map<String, Object>> topSenders;
    private List<Map<String, Object>> topReceivers;
    private List<Map<String, Object>> flows;

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public double getTotalTransferredValue() {
        return totalTransferredValue;
    }

    public void setTotalTransferredValue(double totalTransferredValue) {
        this.totalTransferredValue = totalTransferredValue;
    }

    public double getTotalGasFees() {
        return totalGasFees;
    }

    public void setTotalGasFees(double totalGasFees) {
        this.totalGasFees = totalGasFees;
    }

    public long getUniqueSenders() {
        return uniqueSenders;
    }

    public void setUniqueSenders(long uniqueSenders) {
        this.uniqueSenders = uniqueSenders;
    }

    public long getUniqueReceivers() {
        return uniqueReceivers;
    }

    public void setUniqueReceivers(long uniqueReceivers) {
        this.uniqueReceivers = uniqueReceivers;
    }

    public List<Map<String, Object>> getTopSenders() {
        return topSenders;
    }

    public void setTopSenders(List<Map<String, Object>> topSenders) {
        this.topSenders = topSenders;
    }

    public List<Map<String, Object>> getTopReceivers() {
        return topReceivers;
    }

    public void setTopReceivers(List<Map<String, Object>> topReceivers) {
        this.topReceivers = topReceivers;
    }

    public List<Map<String, Object>> getFlows() {
        return flows;
    }

    public void setFlows(List<Map<String, Object>> flows) {
        this.flows = flows;
    }
}