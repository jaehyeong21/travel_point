package com.example.travel_backend.mapper;


import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DestinationMapper {
    List<TourMainDTO> selectDestinationsByLocation(@Param("areaCode") String areaCode,
                                                   @Param("offset") int offset,
                                                   @Param("count") int count);

    List<TourDTO> selectAllDestinations(); // 관광지 모든 정보

    TourDTO selectDestinations(String contentId);
}
