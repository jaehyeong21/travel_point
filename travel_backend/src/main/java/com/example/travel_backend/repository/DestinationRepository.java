package com.example.travel_backend.repository;

import com.example.travel_backend.model.Destination;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query(value = "SELECT d.* FROM destination d " +
            "LEFT JOIN Review r ON d.destination_id = r.destination_id " +
            "WHERE d.area_code = :areaCode " +
            "GROUP BY d.destination_id " +
            "ORDER BY COUNT(r.id) DESC",
            nativeQuery = true)
    List<Destination> findByAreaCodeOrderByReviewCountDesc(@Param("areaCode") String areaCode, Pageable pageable);
}