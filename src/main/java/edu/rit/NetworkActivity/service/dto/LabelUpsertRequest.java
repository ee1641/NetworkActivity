package edu.rit.NetworkActivity.service.dto;

public class LabelUpsertRequest {
    private String address;
    private String labelName;
    private String category;
    private String entityName;
    private String source;
    private String createdBy;

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLabelName() { return labelName; }
    public void setLabelName(String labelName) { this.labelName = labelName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}