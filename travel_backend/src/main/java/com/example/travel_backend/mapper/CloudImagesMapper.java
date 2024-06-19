package com.example.travel_backend.mapper;

import com.example.travel_backend.data.CloudImagesDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


import java.util.List;

@Mapper
public interface CloudImagesMapper {
    List<CloudImagesDTO> getAllImages();
    List<CloudImagesDTO> getFailedImages();
    List<CloudImagesDTO> getBackupImagesByIds(List<String> contentIds);

    void updateImageUrls(@Param("contentId") String contentId,
                         @Param("firstimage") String firstimage,
                         @Param("firstimage2") String firstimage2,
                         @Param("firstimage3") String firstimage3,
                         @Param("firstimage4") String firstimage4,
                         @Param("firstimage5") String firstimage5);
}

