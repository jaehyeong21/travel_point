package com.example.travel_backend.data;

import com.example.travel_backend.model.ReportType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequestDTO {
    private String content;
    private ReportType reportType;
}