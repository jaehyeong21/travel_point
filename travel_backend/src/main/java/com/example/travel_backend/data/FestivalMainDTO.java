package com.example.travel_backend.data;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FestivalMainDTO {
    private Long id;
    private String location;
    private String title;
    private String firstimage;
    private String description;
    private String areaCode;
}
