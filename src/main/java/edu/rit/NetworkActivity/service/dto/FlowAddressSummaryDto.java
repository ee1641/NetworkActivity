package edu.rit.NetworkActivity.service.dto;

public class FlowAddressSummaryDto {
    private String address;
    private double totalInflow;
    private double totalOutflow;
    private int incomingTxCount;
    private int outgoingTxCount;
    private double totalGasFees;

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getTotalInflow() { return totalInflow; }
    public void setTotalInflow(double totalInflow) { this.totalInflow = totalInflow; }

    public double getTotalOutflow() { return totalOutflow; }
    public void setTotalOutflow(double totalOutflow) { this.totalOutflow = totalOutflow; }

    public int getIncomingTxCount() { return incomingTxCount; }
    public void setIncomingTxCount(int incomingTxCount) { this.incomingTxCount = incomingTxCount; }

    public int getOutgoingTxCount() { return outgoingTxCount; }
    public void setOutgoingTxCount(int outgoingTxCount) { this.outgoingTxCount = outgoingTxCount; }

    public double getTotalGasFees() { return totalGasFees; }
    public void setTotalGasFees(double totalGasFees) { this.totalGasFees = totalGasFees; }
}