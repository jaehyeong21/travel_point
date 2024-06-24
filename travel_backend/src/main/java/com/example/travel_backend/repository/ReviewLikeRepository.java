package com.example.travel_backend.repository;

import com.example.travel_backend.model.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Integer> {
    boolean existsByMemberIdAndReviewId(int memberId, int reviewId);
    void deleteByMemberIdAndReviewId(int memberId, int reviewId);
}