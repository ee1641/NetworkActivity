package edu.rit.NetworkActivity.service.dto;

public class VeChainSummaryDto {
    private String source;
    private Long bestBlockNumber;
    private String bestBlockId;
    private Long bestBlockTimestamp;
    private String message;

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Long getBestBlockNumber() { return bestBlockNumber; }
    public void setBestBlockNumber(Long bestBlockNumber) { this.bestBlockNumber = bestBlockNumber; }

    public String getBestBlockId() { return bestBlockId; }
    public void setBestBlockId(String bestBlockId) { this.bestBlockId = bestBlockId; }

    public Long getBestBlockTimestamp() { return bestBlockTimestamp; }
    public void setBestBlockTimestamp(Long bestBlockTimestamp) { this.bestBlockTimestamp = bestBlockTimestamp; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
