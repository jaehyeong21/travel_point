package com.example.travel_backend.data;


import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TourMainDTO {
    private String locationNumber;
    private String title;
    private String firstimage;
    private String destinationDescription;
    private String contentId;
    private String contentTypeId;
    private String areaCode;
}
