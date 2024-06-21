package com.example.travel_backend.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritesDTO {
    private int favoriteId;
    private int memberId;
    private String memberUsername;
    private long destinationId;
    private String destinationTitle;
    private String destinationLocation;
    private String destinationDescription;
    private String destinationFirstImage;
    private String contentId;
}