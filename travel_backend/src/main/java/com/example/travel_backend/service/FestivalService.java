package com.example.travel_backend.service;

import com.example.travel_backend.data.FestivalDTO;
import com.example.travel_backend.data.FestivalMainDTO;
import com.example.travel_backend.mapper.FestivalMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FestivalService {
    private final FestivalMapper festivalMapper;

    @Autowired
    public FestivalService(FestivalMapper festivalMapper) {
        this.festivalMapper = festivalMapper;
    }

    public List<FestivalDTO> getAllFestival(){
        return festivalMapper.selectFestival();
    }

    public List<FestivalMainDTO> getLocationFestival(String areaCode, int offset, int count, int sort){
        return festivalMapper.selectFestivalByLocation(areaCode, offset, count, sort);
    }

    public int getTotalFestivalCount(String areaCode) {
        return festivalMapper.countFestivalByLocation(areaCode);
    }


    public FestivalDTO getIdFestivalDTO(Long contentId){
        return festivalMapper.selectFestivalById(contentId);
    }
}
