package com.example.travel_backend.service;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.model.Report;
import com.example.travel_backend.model.Review;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.repository.ReportRepository;
import com.example.travel_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Transactional
    public ApiResponse reportReview(int reviewId, String reason, String details, int memberId) {
        if (reportRepository.existsByMemberIdAndReviewId(memberId, reviewId)) {
            return ApiResponse.error("ReportError", "You have already reported this review.");
        }

        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (!reviewOptional.isPresent()) {
            return ApiResponse.error("ReviewError", "Review not found.");
        }

        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (!memberOptional.isPresent()) {
            return ApiResponse.error("MemberError", "Member not found.");
        }

        Review review = reviewOptional.get();
        Member member = memberOptional.get();

        Report report = new Report();
        report.setReview(review);
        report.setMember(member);
        report.setReason(reason);
        report.setDetails(details);
        report.setCreateDate(new Timestamp(System.currentTimeMillis()));

        reportRepository.save(report);

        return ApiResponse.success("Report created successfully.");
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreateDateDesc();
    }
}