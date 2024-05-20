package com.example.travel_backend.service;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.mapper.DestinationMapper;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {
    private final DestinationMapper destinationMapper;

    @Autowired
    public DestinationService(DestinationMapper destinationMapper) {
        this.destinationMapper = destinationMapper;
    }

    public List<TourDTO> getAllDestinations() {
        return destinationMapper.selectAllDestinations();
    }

    public List<TourMainDTO> getDestinationsByLocation(String areaCode, int count, int page) { // 메인 페이지
        return destinationMapper.selectDestinationsByLocation(areaCode, count, page);
    }

    public List<TourDTO> getDestinationsByContentId(String contentId) { // 상세 페이지
        return destinationMapper.selectDestinations(contentId);
    }
}