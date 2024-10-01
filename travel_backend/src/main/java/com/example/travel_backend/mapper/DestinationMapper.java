package com.example.travel_backend.mapper;

import com.example.travel_backend.data.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DestinationMapper {

    // 총 데이터 수를 계산하는 메서드
    int countDestinationsByLocation(@Param("areaCode") String areaCode);

    // 페이징된 데이터를 가져오는 메서드
    List<TourMainDTO> selectDestinationsByLocation(@Param("areaCode") String areaCode,
                                                   @Param("offset") int offset,
                                                   @Param("count") int count, boolean random);

    // 모든 관광지 정보를 가져오는 메서드
    List<TourDTO> selectAllDestinations();

    List<TourTitleDTO> selectAllTitles();

    // 특정 관광지 정보를 가져오는 메서드
    TourDTO selectDestinations(@Param("contentId") String contentId,
                               @Param("contentTypeId") String contentTypeId);

    // 특정 관광지 상세 정보를 가져오는 메서드
    TourDTO selectDestinationDetails(@Param("contentId") String contentId);

    // 특정 축제 상세 정보를 가져오는 메서드
    FestivalDTO selectFestivalDetails(@Param("contentId") String contentId);

    List<TourMainDTO> selectDestinationByNearby(@Param("latitude") String latitude,
                                                @Param("longitude") String longitude,
                                                @Param("areaCode") String areaCode,
                                                @Param("count") int count,
                                                @Param("contentId") String contentId, boolean random);
}
