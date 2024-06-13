package com.example.travel_backend.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ImageMapper {
    List<String> getImageUrls();
    String getImageUrl(@Param("contentId") String contentId);
}