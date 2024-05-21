package com.example.travel_backend.controller.festival;


import com.example.travel_backend.data.FestivalDTO;
import com.example.travel_backend.data.FestivalMainDTO;
import com.example.travel_backend.mapper.AreaCodeMapper;
import com.example.travel_backend.service.FestivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "축제 정보 호출", description = "축제 정보 호출이 가능합니다.")
@RestController
public class FestivalController {
    private final FestivalService festivalService;

    @Autowired
    public FestivalController(FestivalService festivalService) {
        this.festivalService = festivalService;
    }

    @Operation(summary = "축제 데이터 호출", description = "모든 축제 데이터들을 호출합니다.")
    @GetMapping("/festival/All")
    public List<FestivalDTO > getAllFestival() {
        return festivalService.getAllFestival();
    }

    @Operation(summary = "지역별 축제 데이터 호출", description = "지역별 축제 데이터들을 호출합니다.")
    @GetMapping("/festival/location")
    public List<FestivalMainDTO> getLocationFestival(@RequestParam(required = false) String areaName,
                                                     @RequestParam int count,
                                                     @RequestParam int page) {
        String areaCode = null;
        if (areaName != null) {
            areaCode = AreaCodeMapper.getAreaCode(areaName);
            if ("unknown area code".equals(areaCode)) {
                throw new IllegalArgumentException("Invalid area name: " + areaName);
            }
        }
        int offset = (page - 1) * count; // OFFSET 계산
        return festivalService.getLocationFestival(areaCode, offset, count);
    }

    @Operation(summary = " 해당 id 축제 상세 데이터 호출", description = "축제 상세 데이터를 호출합니다.")
    @GetMapping("/festival/id")
    public FestivalDTO getFestivalById(@RequestParam int id) {
        return festivalService.getIdFestivalDTO(id);
    }

}
