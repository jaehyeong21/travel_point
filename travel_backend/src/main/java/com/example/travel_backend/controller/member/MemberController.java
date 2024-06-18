package com.example.travel_backend.controller.member;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
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
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"imageUrl\": \"이미지 URL\"\n" +
            "}\n" +
            "```")
    @PostMapping("/uploadImage")
    public ResponseEntity<ApiResponse> uploadImage(@RequestBody Map<String, String> imageMap,
                                                   @RequestHeader("Authorization") String authorizationHeader) {
        try {
            log.debug("Upload image request received.");

            // Retrieve token from Authorization header
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix

            ApiResponse response = memberService.uploadImage(imageMap, accessToken);

            log.debug("Upload image request processed successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing upload image request.", e);
            return ResponseEntity.status(500).body(ApiResponse.error("ServerError", "Failed to upload image: " + e.getMessage()));
        }
    }
}