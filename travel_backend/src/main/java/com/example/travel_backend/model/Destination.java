package com.example.travel_backend.model;

import jakarta.persistence.*;
import lombok.*;
@Getter
@Setter
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "destination") // 테이블 이름 지정 (소문자)
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id")
    private Long destinationId;

    @Column(name = "location")
    private String location;

    @Column(name = "cat1")
    private String cat1;

    @Column(name = "cat2")
    private String cat2;

    @Column(name = "cat3")
    private String cat3;

    @Column(name = "content_id")
    private String contentId;

    @Column(name = "content_type_id")
    private String contentTypeId;

    @Column(name = "destination_description")
    private String destinationDescription;

    @Column(name = "firstimage")
    private String firstimage;

    @Column(name = "firstimage2")
    private String firstimage2;

    @Column(name = "firstimage3")
    private String firstimage3;

    @Column(name = "firstimage4")
    private String firstimage4;

    @Column(name = "firstimage5")
    private String firstimage5;

    @Column(name = "holiday")
    private String holiday;

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "location_number")
    private String locationNumber;

    @Column(name = "map_x")
    private String mapX;

    @Column(name = "map_y")
    private String mapY;

    @Column(name = "parking")
    private String parking;

    @Column(name = "tel")
    private String tel;

    @Column(name = "title")
    private String title;

    @Column(name = "use_time")
    private String useTime;

    @Column(name = "area_code")
    private String areaCode;
}