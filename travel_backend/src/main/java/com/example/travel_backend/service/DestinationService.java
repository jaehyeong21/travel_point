package com.example.travel_backend.service;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.mapper.DestinationMapper;
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

    public List<TourMainDTO> getDestinationsByLocation(String areaCode, int count, int offset) {
        return destinationMapper.selectDestinationsByLocation(areaCode, offset, count);
    }

    public List<TourDTO> getAllDestinations() {
        return destinationMapper.selectAllDestinations();
    }

    public TourDTO getDestinationsByContentId(String contentId) {
        return destinationMapper.selectDestinations(contentId);
    }
}