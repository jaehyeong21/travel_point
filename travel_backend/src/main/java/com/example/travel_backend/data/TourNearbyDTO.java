package com.example.travel_backend.data;


import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TourNearbyDTO {
    private String title;
    private String firstImage;
    private String contentId;
    private String contentTypeId;
    private String destinationDescription;
}