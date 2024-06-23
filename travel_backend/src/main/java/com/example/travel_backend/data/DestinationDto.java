package com.example.travel_backend.data;

import com.example.travel_backend.model.Destination;
import lombok.*;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DestinationDto {
    private Long destinationId;
    private String location;
    private String cat1;
    private String cat2;
    private String cat3;
    private String contentId;
    private String contentTypeId;
    private String destinationDescription;
    private String firstimage;
    private String firstimage2;
    private String firstimage3;
    private String firstimage4;
    private String firstimage5;
    private String holiday;
    private String homepage;
    private String locationNumber;
    private String mapX;
    private String mapY;
    private String parking;
    private String tel;
    private String title;
    private String useTime;
    private String areaCode;

    static public DestinationDto toDto(Destination destination) {
        return DestinationDto.builder()
                .destinationId(destination.getDestinationId())
                .location(destination.getLocation())
                .cat1(destination.getCat1())
                .cat2(destination.getCat2())
                .cat3(destination.getCat3())
                .contentId(destination.getContentId())
                .contentTypeId(destination.getContentTypeId())
                .destinationDescription(destination.getDestinationDescription())
                .firstimage(destination.getFirstimage())
                .firstimage2(destination.getFirstimage2())
                .firstimage3(destination.getFirstimage3())
                .firstimage4(destination.getFirstimage4())
                .firstimage5(destination.getFirstimage5())
                .holiday(destination.getHoliday())
                .homepage(destination.getHomepage())
                .locationNumber(destination.getLocationNumber())
                .mapX(destination.getMapX())
                .mapY(destination.getMapY())
                .parking(destination.getParking())
                .tel(destination.getTel())
                .title(destination.getTitle())
                .useTime(destination.getUseTime())
                .areaCode(destination.getAreaCode())
                .build();
    }
}