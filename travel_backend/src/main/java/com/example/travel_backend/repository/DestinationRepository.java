package com.example.travel_backend.repository;

import com.example.travel_backend.model.Destination;
import com.example.travel_backend.model.Review;
import jakarta.persistence.OneToMany;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    @Query("SELECT d FROM Destination d LEFT JOIN d.reviews r GROUP BY d.destinationId ORDER BY COUNT(r) DESC")
    List<Destination> findAllOrderByReviewCountDesc();

}