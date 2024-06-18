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
public class Favorites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int favoriteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", referencedColumnName = "destination_id")
    private Destination destination;
}