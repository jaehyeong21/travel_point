package com.example.travel_backend.controller.review;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.ReviewRequestDTO;
import com.example.travel_backend.data.ReviewResponseDTO;
import com.example.travel_backend.data.ReviewStatsResponseDTO;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Review;
import com.example.travel_backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "특정 목적지의 리뷰 조회", description = "destination_id를 사용하여 특정 목적지의 리뷰를 최신 날짜 순으로 조회합니다.")
    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<ApiResponse> getReviewsByDestinationId(@PathVariable Long destinationId) {
        try {
            List<Review> reviews = reviewService.getReviewsByDestinationId(destinationId);
            List<ReviewResponseDTO> reviewResponseDTOs = new ArrayList<>();
            for (Review review : reviews) {
                reviewResponseDTOs.add(reviewService.convertToResponseDTO(review));
            }
            return ResponseEntity.ok(ApiResponse.success(reviewResponseDTOs));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "특정 목적지의 총 리뷰 갯수 조회", description = "특정 목적지의 리뷰 수를 조회합니다.")
    @GetMapping("/destination/{destinationId}/count")
    public ResponseEntity<ApiResponse> getReviewCountByDestinationId(@PathVariable Long destinationId) {
        try {
            long reviewCount = reviewService.getReviewCountByDestinationId(destinationId);
            return ResponseEntity.ok(ApiResponse.success(reviewCount));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "특정 목적지의 별점 통계 조회", description = "특정 목적지의 별점 통계를 조회합니다. 평균, 최대, 최소 별점을 반환합니다.")
    @GetMapping("/destination/{destinationId}/ratings")
    public ResponseEntity<ApiResponse> getReviewRatingsByDestinationId(@PathVariable Long destinationId) {
        try {
            Double averageRating = reviewService.getAverageRatingByDestinationId(destinationId);
            Integer maxRating = reviewService.getMaxRatingByDestinationId(destinationId);
            Integer minRating = reviewService.getMinRatingByDestinationId(destinationId);

            ReviewStatsResponseDTO stats = new ReviewStatsResponseDTO(reviewService.getReviewCountByDestinationId(destinationId), averageRating, maxRating, minRating);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "특정 목적지의 리뷰를 별점 높은 순으로 조회", description = "특정 목적지의 리뷰를 별점 높은 순, 좋아요 수 순, 최신 날짜 순으로 조회합니다.")
    @GetMapping("/destination/{destinationId}/rate-desc")
    public ResponseEntity<ApiResponse> getReviewsByDestinationIdOrderByRateDesc(@PathVariable Long destinationId) {
        try {
            List<Review> reviews = reviewService.getReviewsByDestinationIdOrderByRateDesc(destinationId);
            List<ReviewResponseDTO> reviewResponseDTOs = new ArrayList<>();
            for (Review review : reviews) {
                reviewResponseDTOs.add(reviewService.convertToResponseDTO(review));
            }
            return ResponseEntity.ok(ApiResponse.success(reviewResponseDTOs));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "특정 목적지의 리뷰를 별점 낮은 순으로 조회", description = "특정 목적지의 리뷰를 별점 낮은 순, 좋아요 수 순, 최신 날짜 순으로 조회합니다.")
    @GetMapping("/destination/{destinationId}/rate-asc")
    public ResponseEntity<ApiResponse> getReviewsByDestinationIdOrderByRateAsc(@PathVariable Long destinationId) {
        try {
            List<Review> reviews = reviewService.getReviewsByDestinationIdOrderByRateAsc(destinationId);
            List<ReviewResponseDTO> reviewResponseDTOs = new ArrayList<>();
            for (Review review : reviews) {
                reviewResponseDTOs.add(reviewService.convertToResponseDTO(review));
            }
            return ResponseEntity.ok(ApiResponse.success(reviewResponseDTOs));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "리뷰 생성", description = "새로운 리뷰를 생성합니다.\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"content\": \"리뷰 내용\",\n" +
            "  \"rate\": 5,\n" +
            "  \"destinationId\": 1,\n" +
            "  \"imageUrl\": \"http://example.com/image.jpg\"\n" +
            "}\n" +
            "```")
    @PostMapping
    public ResponseEntity<ApiResponse> createReview(@RequestBody @Valid ReviewRequestDTO reviewRequestDTO, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getUsernameFromToken(token.substring(7)); // "Bearer " 제거
        ApiResponse response = reviewService.createReview(reviewRequestDTO, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "리뷰 수정", description = "ID를 사용하여 특정 리뷰를 수정합니다. 수정하려는 리뷰의 작성자만 수정할 수 있습니다.\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"content\": \"수정된 리뷰 내용\",\n" +
            "  \"rate\": 4,\n" +
            "  \"imageUrl\": \"http://example.com/new_image.jpg\"\n" +
            "}\n" +
            "```\n" +
            "Example request header:\n" +
            "```json\n" +
            "{\n" +
            "  \"Authorization\": \"Bearer {accessToken}\"\n" +
            "}\n" +
            "```")
    @PutMapping("/modify/{id}")
    public ResponseEntity<ApiResponse> updateReview(
            @PathVariable int id,
            @RequestBody ReviewRequestDTO reviewRequestDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix
            ApiResponse response = reviewService.updateReview(
                    id,
                    reviewRequestDTO.getContent(),
                    reviewRequestDTO.getRate(),
                    reviewRequestDTO.getImageUrl(),
                    accessToken
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "리뷰 삭제", description = "ID를 사용하여 특정 리뷰를 삭제합니다. 삭제하려는 리뷰의 작성자만 삭제할 수 있습니다.\n\n" +
            "Example request header:\n" +
            "```json\n" +
            "{\n" +
            "  \"Authorization\": \"Bearer {accessToken}\"\n" +
            "}\n" +
            "```")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix
            reviewService.deleteReview(id, accessToken);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }
}