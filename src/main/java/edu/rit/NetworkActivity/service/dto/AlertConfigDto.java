package edu.rit.NetworkActivity.service.dto;

public class AlertConfigDto {
    private float anomalyThreshold = 75f;
    private float largeTxThreshold = 1000f;
    private float activitySpikePercent = 50f;

    public float getAnomalyThreshold() { return anomalyThreshold; }
    public void setAnomalyThreshold(float anomalyThreshold) { this.anomalyThreshold = anomalyThreshold; }

    public float getLargeTxThreshold() { return largeTxThreshold; }
    public void setLargeTxThreshold(float largeTxThreshold) { this.largeTxThreshold = largeTxThreshold; }

    public float getActivitySpikePercent() { return activitySpikePercent; }
    public void setActivitySpikePercent(float activitySpikePercent) { this.activitySpikePercent = activitySpikePercent; }
}
