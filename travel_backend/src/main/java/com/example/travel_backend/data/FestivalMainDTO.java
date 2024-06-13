package com.example.travel_backend.data;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FestivalMainDTO {
    private Long contentId;
    private String contentTypeId;
    private String location;
    private String title;
    private String firstImage;
    private String destinationDescription;
    private String areaCode;
    private String startDate;
    private String endDate;
}
