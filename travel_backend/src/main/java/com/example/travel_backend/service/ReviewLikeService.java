package com.example.travel_backend.service;

import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.model.Review;
import com.example.travel_backend.model.ReviewLike;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.repository.ReviewLikeRepository;
import com.example.travel_backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
public class ReviewLikeService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewLikeRepository reviewLikeRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void likeReview(int reviewId, int memberId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));

        if (reviewLikeRepository.existsByMemberIdAndReviewId(memberId, reviewId)) {
            review.setLikeCount(review.getLikeCount() - 1);
            reviewLikeRepository.deleteByMemberIdAndReviewId(memberId, reviewId);
        } else {
            review.setLikeCount(review.getLikeCount() + 1);
            ReviewLike reviewLike = new ReviewLike();
            reviewLike.setMemberId(memberId);
            reviewLike.setReviewId(reviewId);
            reviewLikeRepository.save(reviewLike);
        }

        reviewRepository.save(review);
    }
}