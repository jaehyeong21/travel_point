package com.example.travel_backend.controller.festival;

import com.example.travel_backend.data.FestivalDTO;
import com.example.travel_backend.data.FestivalMainDTO;
import com.example.travel_backend.mapper.AreaCodeMapper;
import com.example.travel_backend.service.FestivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public List<FestivalDTO> getAllFestival() {
        return festivalService.getAllFestival();
    }

    @GetMapping("/festival/location")
    public ResponseEntity<Map<String, Object>> getLocationFestival(@RequestParam(required = false) String areaName,
                                                                   @RequestParam int count,
                                                                   @RequestParam int page,
                                                                   @RequestParam(defaultValue = "0") Integer sort) {
        System.out.println("Received - areaName: " + areaName + ", count: " + count + ", page: " + page + ", sort: " + sort);
        String areaCode = null;
        if (areaName != null) {
            areaCode = AreaCodeMapper.getAreaCode(areaName);
            if ("unknown area code".equals(areaCode)) {
                throw new IllegalArgumentException("Invalid area name: " + areaName);
            }
        }
        int offset = (page - 1) * count;
        List<FestivalMainDTO> festivals = festivalService.getLocationFestival(areaCode, offset, count, sort);
        int totalData = festivalService.getTotalFestivalCount(areaCode);
        int totalPages = (int) Math.ceil((double) totalData / count);

        Map<String, Object> response = new HashMap<>();
        response.put("totalData", totalData);
        response.put("destinations", festivals);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);

        System.out.println("Festivals found: " + festivals.size());
        return ResponseEntity.ok(response);
    }


    @Operation(summary = " 해당 id 축제 상세 데이터 호출", description = "축제 상세 데이터를 호출합니다.")
    @GetMapping("/festival/contentId")
    public FestivalDTO getFestivalById(@RequestParam Long contentId) {
        return festivalService.getIdFestivalDTO(contentId);
    }
}