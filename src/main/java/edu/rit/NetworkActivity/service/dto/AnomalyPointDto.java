package edu.rit.NetworkActivity.service.dto;

import java.util.List;

public class AnomalyPointDto {
    private String label;
    private double score;
    private List<String> topAddresses;

    public AnomalyPointDto(String label, double score, List<String> topAddresses) {
        this.label = label;
        this.score = score;
        this.topAddresses = topAddresses;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public List<String> getTopAddresses() { return topAddresses; }
    public void setTopAddresses(List<String> topAddresses) { this.topAddresses = topAddresses; }
}
