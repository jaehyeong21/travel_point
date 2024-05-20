package com.example.travel_backend.mapper;


import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DestinationMapper {
    List<TourMainDTO> selectDestinationsByLocation(String areaCode, int page, int count);

    List<TourDTO> selectAllDestinations(); // 관광지 모든 정보

    List<TourDTO> selectDestinations(String contentId);
}
