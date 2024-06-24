package com.example.travel_backend.controller.report;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.ReportRequestDTO;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Report;
import com.example.travel_backend.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "리뷰 신고", description = "리뷰에 대해 신고를 합니다.\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"reason\": \"신고 이유\",\n" +
            "  \"details\": \"신고 내용\"\n" +
            "}\n" +
            "```")
    @PostMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> reportReview(@PathVariable int reviewId, @RequestBody ReportRequestDTO reportRequest, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getUsernameFromToken(token.substring(7));
        int memberId = jwtTokenProvider.getMemberIdFromToken(token.substring(7));
        ApiResponse response = reportService.reportReview(reviewId, reportRequest.getReason(), reportRequest.getDetails(), memberId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "신고 목록 조회", description = "관리자는 모든 신고 목록을 조회할 수 있습니다.")
    @GetMapping
    public ResponseEntity<ApiResponse> getAllReports(@RequestHeader("Authorization") String token) {
        String role = jwtTokenProvider.getRoleFromToken(token.substring(7));

        if (!"ROLE_ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(ApiResponse.error("FORBIDDEN", "Unauthorized request"));
        }

        List<Report> reports = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
}