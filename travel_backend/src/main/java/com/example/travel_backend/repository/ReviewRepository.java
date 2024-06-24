package com.example.travel_backend.repository;

import com.example.travel_backend.model.Destination;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByDestinationDestinationIdOrderByCreateDateDesc(Long destinationId);
    List<Review> findByDestinationDestinationIdOrderByRateDescLikeCountDescCreateDateDesc(Long destinationId);
    List<Review> findByDestinationDestinationIdOrderByRateAscLikeCountDescCreateDateDesc(Long destinationId);
    long countByDestination(Destination destination);
    boolean existsByMemberAndDestination(Member member, Destination destination);
    List<Review> findByMemberOrderByCreateDateDesc(Member member);

    @Query("SELECT AVG(r.rate) FROM Review r WHERE r.destination.destinationId = :destinationId")
    Double findAverageRatingByDestinationId(@Param("destinationId") Long destinationId);

    @Query("SELECT MAX(r.rate) FROM Review r WHERE r.destination.destinationId = :destinationId")
    Integer findMaxRatingByDestinationId(@Param("destinationId") Long destinationId);

    @Query("SELECT MIN(r.rate) FROM Review r WHERE r.destination.destinationId = :destinationId")
    Integer findMinRatingByDestinationId(@Param("destinationId") Long destinationId);
}