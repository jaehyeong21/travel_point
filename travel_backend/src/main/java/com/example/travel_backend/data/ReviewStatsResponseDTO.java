package com.example.travel_backend.data;

public class ReviewStatsResponseDTO {
    private long reviewCount;
    private Double averageRating;
    private Integer maxRating;
    private Integer minRating;

    public ReviewStatsResponseDTO(long reviewCount, Double averageRating, Integer maxRating, Integer minRating) {
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
        this.maxRating = maxRating;
        this.minRating = minRating;
    }

    public long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }

    public Integer getMinRating() {
        return minRating;
    }

    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }
}