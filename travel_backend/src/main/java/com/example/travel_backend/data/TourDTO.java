package com.example.travel_backend.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // 기본 생성자 자동으로 추가
public class TourDTO {
    private Long destinationId;
    private String location;
    private String areaCode;
    private String cat1;
    private String cat2;
    private String cat3;
    private String firstImage;
    private String firstImage2;
    private String firstImage3;
    private String firstImage4;
    private String firstImage5;
    private String locationNumber;
    private String contentId;
    private String contentTypeId;
    private String title;
    private String mapX;
    private String mapY;
    private String homepage;
    private String parking;
    private String use_time;
    private String tel;
    private String destinationDescription;
}
