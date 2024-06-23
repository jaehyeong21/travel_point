package com.example.travel_backend.data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
public class ReviewResponseDTO {
    private int id;
    private String content;
    private int rate;
    private Long destinationId;
    private String imageUrl;
    private String memberEmail;
    private long reviewCount;
    private Timestamp modifyDate;
    private MemberDto user;
    private Timestamp createDate;
    private DestinationDto destination;
}