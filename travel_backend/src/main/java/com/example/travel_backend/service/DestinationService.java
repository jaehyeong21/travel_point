package com.example.travel_backend.service;

import com.example.travel_backend.data.*;
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

    // 지역별 총 데이터 수를 계산하는 메서드
    public int countDestinationsByLocation(String areaCode) {
        return destinationMapper.countDestinationsByLocation(areaCode);
    }

    // 지역별 페이징된 데이터를 가져오는 메서드
    public List<TourMainDTO> getDestinationsByLocation(String areaCode, int count, int offset, boolean random) {
        return destinationMapper.selectDestinationsByLocation(areaCode, offset, count, random);
    }

    // 모든 관광지 정보를 가져오는 메서드
    public List<TourDTO> getAllDestinations() {
        return destinationMapper.selectAllDestinations();
    }

    public List<TourTitleDTO> getAllDestinationsTitle() {
        return destinationMapper.selectAllTitles();
    }

    public List<TourMainDTO> getDestinationByNearby(String latitude, String longitude, String areaCode, int count,
                                                    String contentId, boolean random) {
        return destinationMapper.selectDestinationByNearby(latitude, longitude, areaCode, count, contentId, random);
    }

    // contentId와 contentTypeId로 관광 데이터를 가져오는 메서드
    public Object getDestinationsByContentId(String contentId, String contentTypeId) {
        if(contentTypeId == null || "0".equals(contentTypeId)) {
            // contentTypeId가 null이거나 0일 때 contentId에 맞는 정보만 불러옴
            if (Integer.parseInt(contentId) >= 1 && Integer.parseInt(contentId) <= 40) {
                // 축제 데이터
                return destinationMapper.selectFestivalDetails(contentId);
            } else {
                // 관광 데이터
                return destinationMapper.selectDestinationDetails(contentId);
            }
        } else if ("15".equals(contentTypeId)) {
            // contentTypeId가 15일 때 축제 데이터 불러옴
            return destinationMapper.selectFestivalDetails(contentId);
        } else {
            // 기타 contentTypeId에 맞는 관광 데이터 불러옴
            return destinationMapper.selectDestinations(contentId, contentTypeId);
        }
    }
}
