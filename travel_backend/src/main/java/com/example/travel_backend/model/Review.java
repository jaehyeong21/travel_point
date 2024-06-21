package com.example.travel_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonProperty
    private String content;

    @JsonProperty
    private LocalDate createDate;

    @JsonProperty
    private LocalDate modify_date;

    @JsonProperty
    private String member_id;

    @JsonProperty
    private Integer rate;

    @JsonProperty
    private Integer count;

    @JsonProperty
    private String imageUrl;

    @ManyToOne
    @JsonProperty
    private Destination contentId;

}