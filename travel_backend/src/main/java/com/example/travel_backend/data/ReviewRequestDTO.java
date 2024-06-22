package com.example.travel_backend.data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class ReviewRequestDTO {
    private String content;
    private int rate;
    private Long destinationId;
    private String imageUrl;
}