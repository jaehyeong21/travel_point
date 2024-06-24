package com.example.travel_backend.controller.like;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.service.ReviewLikeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/review-likes")
public class ReviewLikeController {

    @Autowired
    private ReviewLikeService reviewLikeService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "리뷰 좋아요",
            description = "특정 리뷰에 대해 좋아요를 누릅니다. 사용자가 이미 좋아요를 누른 경우, 좋아요가 취소됩니다.\n\n" +
                    "Example request header:\n" +
                    "```http\n" +
                    "Authorization: Bearer <JWT 토큰>\n" +
                    "```\n" +
                    "Example request URL:\n" +
                    "```http\n" +
                    "POST /review-likes/{reviewId}/like\n" +
                    "```")
    @PostMapping("/{reviewId}/like")
    public ResponseEntity<ApiResponse> likeReview(@PathVariable int reviewId, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getUsernameFromToken(token.substring(7));
        int memberId = jwtTokenProvider.getMemberIdFromToken(token.substring(7));

        reviewLikeService.likeReview(reviewId, memberId);

        return ResponseEntity.ok(ApiResponse.success("Review liked/unliked successfully"));
    }
}