package com.example.travel_backend.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FestivalDTO {
    private Long contentId;
    private String title;
    private String tel;
    private String areaCode;
    private String location;
    private String mapX;
    private String mapY;
    private String firstImage;
    private String homepage;
    private String introduction;
    private String startDate;
    private String endDate;
    private String useTime;
    private String charge;
    private String contentTypeId;
    private String destinationDescription;
}
