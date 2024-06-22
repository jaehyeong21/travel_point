package com.example.travel_backend.service;

import com.example.travel_backend.model.Report;
import com.example.travel_backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Report> getReportById(int id) {
        return reportRepository.findById(id);
    }

    @Transactional
    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    @Transactional
    public void deleteReport(int id) {
        reportRepository.deleteById(id);
    }
}