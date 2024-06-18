package com.example.travel_backend.repository;

import com.example.travel_backend.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
}