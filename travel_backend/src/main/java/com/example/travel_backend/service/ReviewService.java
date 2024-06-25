package com.example.travel_backend.service;

import com.example.travel_backend.data.*;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Destination;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.model.Review;
import com.example.travel_backend.repository.DestinationRepository;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Optional<Review> getReviewById(int id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getReviewsByDestinationId(Long destinationId) {
        return reviewRepository.findByDestinationDestinationIdOrderByCreateDateDesc(destinationId);
    }

    public List<Review> getReviewsByDestinationIdOrderByRateDesc(Long destinationId) {
        return reviewRepository.findByDestinationDestinationIdOrderByRateDescLikeCountDescCreateDateDesc(destinationId);
    }

    public List<Review> getReviewsByDestinationIdOrderByRateAsc(Long destinationId) {
        return reviewRepository.findByDestinationDestinationIdOrderByRateAscLikeCountDescCreateDateDesc(destinationId);
    }

    @Transactional
    public ApiResponse createReview(ReviewRequestDTO reviewRequestDTO, String email) {
        Optional<Member> optionalMember = memberRepository.findByEmail(email);

        if (!optionalMember.isPresent()) {
            return ApiResponse.error("MemberError", "Member not found.");
        }

        Member member = optionalMember.get();
        Optional<Destination> optionalDestination = destinationRepository.findById(reviewRequestDTO.getDestinationId());

        if (!optionalDestination.isPresent()) {
            return ApiResponse.error("DestinationError", "Destination not found.");
        }

        Destination destination = optionalDestination.get();

        // 사용자가 해당 destination에 리뷰를 이미 작성했는지 확인
        boolean existingReview = reviewRepository.existsByMemberAndDestination(member, destination);
        if (existingReview) {
            return ApiResponse.error("ReviewError", "You have already reviewed this destination.");
        }

        Review review = new Review();
        review.setContent(reviewRequestDTO.getContent());
        review.setRate(reviewRequestDTO.getRate());
        review.setImageUrl(reviewRequestDTO.getImageUrl());
        review.setDestination(destination);
        review.setMember(member);
        review.setCreateDate(new Timestamp(System.currentTimeMillis()));
        review.setModifyDate(new Timestamp(System.currentTimeMillis())); // Set modifyDate at creation

        reviewRepository.save(review);

        ReviewResponseDTO responseDTO = convertToResponseDTO(review);

        return ApiResponse.success("Review created successfully", responseDTO);
    }

    @Transactional
    public ApiResponse updateReview(int id, String content, int rate, String imageUrl, String accessToken) {
        Optional<Review> reviewOptional = reviewRepository.findById(id);
        if (!reviewOptional.isPresent()) {
            throw new RuntimeException("Review not found with id " + id);
        }

        Review review = reviewOptional.get();

        String email = jwtTokenProvider.getUsernameFromToken(accessToken);
        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        if (!memberOptional.isPresent() || !review.getMember().equals(memberOptional.get())) {
            throw new RuntimeException("You do not have permission to update this review");
        }

        review.setContent(content);
        review.setRate(rate);
        review.setImageUrl(imageUrl);
        review.setModifyDate(new Timestamp(System.currentTimeMillis())); // Update modifyDate

        reviewRepository.save(review);

        ReviewResponseDTO responseDTO = convertToResponseDTO(review);

        return ApiResponse.success(responseDTO);
    }

    @Transactional
    public ApiResponse deleteReview(int id, String accessToken) {
        Optional<Review> reviewOptional = reviewRepository.findById(id);
        if (!reviewOptional.isPresent()) {
            return ApiResponse.error("ReviewError", "Review not found with id " + id);
        }

        Review review = reviewOptional.get();

        String email = jwtTokenProvider.getUsernameFromToken(accessToken);
        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        if (!memberOptional.isPresent()) {
            return ApiResponse.error("MemberError", "Member not found with email " + email);
        }

        Member member = memberOptional.get();

        System.out.println("Member role: " + member.getRole());

        if (!review.getMember().equals(member) && !"ROLE_ADMIN".equalsIgnoreCase(member.getRole())) {
            System.out.println("Permission denied for user: " + member.getEmail());
            return ApiResponse.error("PermissionError", "You do not have permission to delete this review");
        }

        reviewRepository.delete(review);

        return ApiResponse.success("Review deleted successfully", null);
    }

    public List<Review> getMyReviews(int memberId) {
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (!memberOptional.isPresent()) {
            log.error("Member not found for ID: " + memberId);
            throw new RuntimeException("Member not found for ID: " + memberId);
        }

        Member member = memberOptional.get();
        return reviewRepository.findByMemberOrderByCreateDateDesc(member);
    }


    public ReviewResponseDTO convertToResponseDTO(Review review) {
        MemberDto memberDto = MemberDto.toDto(review.getMember());
        DestinationDto destinationDto = DestinationDto.toDto(review.getDestination());

        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setContent(review.getContent());
        dto.setRate(review.getRate());
        dto.setDestinationId(review.getDestination().getDestinationId());
        dto.setImageUrl(review.getImageUrl());
        dto.setMemberEmail(review.getMember().getEmail());
        dto.setLikeCount(review.getLikeCount());
        dto.setModifyDate(review.getModifyDate());
        dto.setCreateDate(review.getCreateDate());
        dto.setUser(memberDto);
        dto.setDestination(destinationDto); // 추가된 필드

        return dto;
    }

    // 회원 유효성 확인
    public boolean isMemberValid(String email, int memberId) {
        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        return memberOptional.isPresent() && memberOptional.get().getId() == memberId;
    }

    public long getReviewCountByDestinationId(Long destinationId) {
        Optional<Destination> optionalDestination = destinationRepository.findById(destinationId);

        if (!optionalDestination.isPresent()) {
            throw new RuntimeException("Destination not found");
        }

        Destination destination = optionalDestination.get();
        return reviewRepository.countByDestination(destination);
    }

    public Double getAverageRatingByDestinationId(Long destinationId) {
        return reviewRepository.findAverageRatingByDestinationId(destinationId);
    }

    public Integer getMaxRatingByDestinationId(Long destinationId) {
        return reviewRepository.findMaxRatingByDestinationId(destinationId);
    }

    public Integer getMinRatingByDestinationId(Long destinationId) {
        return reviewRepository.findMinRatingByDestinationId(destinationId);
    }
}