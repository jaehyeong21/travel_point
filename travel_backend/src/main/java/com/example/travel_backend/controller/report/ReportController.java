package com.example.travel_backend.controller.report;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.model.Report;
import com.example.travel_backend.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Operation(summary = "모든 신고 조회", description = "모든 신고를 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse> getAllReports() {
        List<Report> reports = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @Operation(summary = "신고 조회", description = "ID를 사용하여 특정 신고를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getReportById(@PathVariable int id) {
        Optional<Report> optionalReport = reportService.getReportById(id);
        if (optionalReport.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(optionalReport.get()));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", "Report not found with id " + id));
        }
    }

    @Operation(summary = "신고 생성", description = "새로운 신고를 생성합니다.\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"reason\": \"신고 사유\",\n" +
            "  \"description\": \"세부 설명\",\n" +
            "  \"memberId\": 1,\n" +
            "  \"reviewId\": 1\n" +
            "}\n" +
            "```")
    @PostMapping
    public ResponseEntity<ApiResponse> createReport(@RequestBody Report report) {
        Report createdReport = reportService.createReport(report);
        return ResponseEntity.ok(ApiResponse.success(createdReport));
    }

    @Operation(summary = "신고 삭제", description = "ID를 사용하여 특정 신고를 삭제합니다.\n\n" +
            "Example request:\n" +
            "`DELETE /reports/{id}`")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteReport(@PathVariable int id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}