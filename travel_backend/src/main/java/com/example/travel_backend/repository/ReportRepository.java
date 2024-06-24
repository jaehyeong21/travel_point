package com.example.travel_backend.repository;

import com.example.travel_backend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findAllByOrderByCreateDateDesc();
    boolean existsByMemberIdAndReviewId(int memberId, int reviewId);
}