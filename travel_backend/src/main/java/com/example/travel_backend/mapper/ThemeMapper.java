package com.example.travel_backend.mapper;


import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ThemeMapper {
    List<TourMainDTO> selectAllThemes(@Param("count") int count, @Param("offset") int offset);

    List<TourMainDTO> selectByTheme(@Param("areaCode") String areaCode,
                                    @Param("count") int count,
                                    @Param("offset") int offset,
                                    @Param("cat1") String cat1,
                                    @Param("cat2") String cat2,
                                    @Param("cat3") String cat3,
                                    @Param("random") boolean random);

    int countByTheme(@Param("areaCode") String areaCode,
                     @Param("cat1") String cat1,
                     @Param("cat2") String cat2,
                     @Param("cat3") String cat3);

    TourDTO selectByContentId(@Param("contentId") String contentId);
}