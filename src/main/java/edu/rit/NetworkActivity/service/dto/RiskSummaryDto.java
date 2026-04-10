package edu.rit.NetworkActivity.service.dto;

public class RiskSummaryDto {
    private long abnormalPatterns;
    private long largeTransfers;
    private long activitySpikes;

    public long getAbnormalPatterns() { return abnormalPatterns; }
    public void setAbnormalPatterns(long abnormalPatterns) { this.abnormalPatterns = abnormalPatterns; }

    public long getLargeTransfers() { return largeTransfers; }
    public void setLargeTransfers(long largeTransfers) { this.largeTransfers = largeTransfers; }

    public long getActivitySpikes() { return activitySpikes; }
    public void setActivitySpikes(long activitySpikes) { this.activitySpikes = activitySpikes; }
}
