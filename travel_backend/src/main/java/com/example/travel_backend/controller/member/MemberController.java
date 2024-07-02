package com.example.travel_backend.controller.member;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
public class MemberController {
    @Autowired
    private MemberService memberService;

    // 이미지 업로드
    @Operation(summary = "이미지 업로드", description = "JWT 토큰으로 인증된 사용자가 이미지 URL을 업로드합니다.\n\n" +
            "예시 요청:\n\n" +
            "Headers:\n" +
            "```\n" +
            "Authorization: Bearer <accessToken>\n" +
            "Body (JSON):\n" +
            "{\n" +
            "  \"imageUrl\": \"이미지 URL\"\n" +
            "}\n" +
            "```")
    @PostMapping("/uploadImage")
    public ResponseEntity<ApiResponse> uploadImage(@RequestBody Map<String, String> imageMap,
                                                   @RequestHeader("Authorization") String authorizationHeader,
                                                   HttpServletResponse response) {
        try {
            log.debug("Upload image request received.");

            // Retrieve token from Authorization header
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix

            // Ensure token format
            if (accessToken.split("\\.").length != 3) {
                throw new IllegalArgumentException("Invalid JWT token format.");
            }

            ApiResponse apiResponse = memberService.uploadImage(imageMap, accessToken);

            if (apiResponse.isResponse()) {
                JwtToken newJwtToken = (JwtToken) ((Map<String, Object>) apiResponse.getResult()).get("token");

                // Set new refreshToken as HttpOnly cookie
                Cookie refreshTokenCookie = new Cookie("refreshToken", newJwtToken.getRefreshToken());
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setPath("/");
                response.addCookie(refreshTokenCookie);

                // Optionally, add new accessToken to the response body
                ((Map<String, Object>) apiResponse.getResult()).put("accessToken", newJwtToken.getAccessToken());
            }

            log.debug("Upload image request processed successfully.");
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            log.error("Error processing upload image request.", e);
            return ResponseEntity.status(500).body(ApiResponse.error("ServerError", "Failed to upload image: " + e.getMessage()));
        }
    }
}