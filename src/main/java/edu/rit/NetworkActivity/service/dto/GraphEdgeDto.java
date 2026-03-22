package edu.rit.NetworkActivity.service.dto;

public class GraphEdgeDto {
    private String source;
    private String target;
    private String txHash;
    private double value;
    private double gasFee;

    public GraphEdgeDto() {}

    public GraphEdgeDto(String source, String target, String txHash, double value, double gasFee) {
        this.source = source;
        this.target = target;
        this.txHash = txHash;
        this.value = value;
        this.gasFee = gasFee;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getTxHash() { return txHash; }
    public void setTxHash(String txHash) { this.txHash = txHash; }

    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }

    public double getGasFee() { return gasFee; }
    public void setGasFee(double gasFee) { this.gasFee = gasFee; }
}
