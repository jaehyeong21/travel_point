package com.example.travel_backend.data;


import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TourMainDTO {
    private String location;
    private String title;
    private String firstImage;
    private String destinationDescription;
    private String contentId;
    private String contentTypeId;
    private String areaCode;
    private long reviewCount;  // 리뷰 수 필드 추가
}
