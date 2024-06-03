package com.example.travel_backend.mapper;

import com.example.travel_backend.data.FestivalDTO;
import com.example.travel_backend.data.FestivalMainDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FestivalMapper {
    List<FestivalDTO> selectFestival();
    List<FestivalMainDTO> selectFestivalByLocation(@Param("areaCode") String areaCode, @Param("offset") int offset, @Param("count") int count, @Param("sort") int sort);
    FestivalDTO selectFestivalById(@Param("contentId") Long contentId);
    int countFestivalByLocation(@Param("areaCode") String areaCode);
}
