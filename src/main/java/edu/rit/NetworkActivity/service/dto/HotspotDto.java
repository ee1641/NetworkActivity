package edu.rit.NetworkActivity.service.dto;

public class HotspotDto {
    private String address;
    private String labelName;
    private String category;
    private long transactionCount;
    private double totalVolume;
    private double avgTransactionValue;

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLabelName() { return labelName; }
    public void setLabelName(String labelName) { this.labelName = labelName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(long transactionCount) { this.transactionCount = transactionCount; }

    public double getTotalVolume() { return totalVolume; }
    public void setTotalVolume(double totalVolume) { this.totalVolume = totalVolume; }

    public double getAvgTransactionValue() { return avgTransactionValue; }
    public void setAvgTransactionValue(double avgTransactionValue) { this.avgTransactionValue = avgTransactionValue; }
}