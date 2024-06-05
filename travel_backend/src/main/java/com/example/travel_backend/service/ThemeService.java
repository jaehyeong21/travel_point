package com.example.travel_backend.service;


import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.mapper.AreaCodeMapper;
import com.example.travel_backend.mapper.ThemeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeService {
    private final ThemeMapper themeMapper;

    @Autowired
    public ThemeService(ThemeMapper themeMapper) {
        this.themeMapper = themeMapper;
    }

    public List<TourMainDTO> getThemes(String areaName, int count, int page, String cat1, String cat2, String cat3, boolean random) {
        String areaCode = null;
        if (areaName != null) {
            areaCode = AreaCodeMapper.getAreaCode(areaName);
            if ("unknown area code".equals(areaCode)) {
                throw new IllegalArgumentException("Invalid area name: " + areaName);
            }
        }

        int offset = (page - 1) * count;

        return themeMapper.selectByTheme(areaCode, count, offset, cat1, cat2, cat3, random);
    }

    public int getTotalDataCount(String areaCode, String cat1, String cat2, String cat3) {
        return themeMapper.countByTheme(areaCode, cat1, cat2, cat3);
    }

    public TourDTO getThemesByContentId(String contentId){
        return themeMapper.selectByContentId(contentId);
    }
}
