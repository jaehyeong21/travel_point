package com.example.travel_backend.repository;

import com.example.travel_backend.model.Favorites;
import com.example.travel_backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritesRepository extends JpaRepository<Favorites, Integer> {
    List<Favorites> findByMember(Member member);
}