package edu.rit.NetworkActivity.service.dto;

import java.util.List;

public class HotspotPageDto {
    private List<HotspotDto> content;
    private int page;
    private int pageSize;
    private long totalCount;
    private int totalPages;
    private long totalTransactions;
    private double totalVolume;

    public List<HotspotDto> getContent() { return content; }
    public void setContent(List<HotspotDto> content) { this.content = content; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }

    public long getTotalCount() { return totalCount; }
    public void setTotalCount(long totalCount) { this.totalCount = totalCount; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }

    public double getTotalVolume() { return totalVolume; }
    public void setTotalVolume(double totalVolume) { this.totalVolume = totalVolume; }
}
