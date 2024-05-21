package com.example.travel_backend.mapper;

import com.example.travel_backend.data.FestivalDTO;
import com.example.travel_backend.data.FestivalMainDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface FestivalMapper {
    List<FestivalDTO> selectFestival();//축제 모든 정보
    List<FestivalMainDTO> selectFestivalByLocation(@Param("areaCode") String areaCode, @Param("offset") int offset, @Param("count") int count);
    FestivalDTO selectFestivalById(@Param("id") int id);
}