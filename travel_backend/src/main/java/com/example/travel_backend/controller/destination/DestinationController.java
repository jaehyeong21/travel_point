package com.example.travel_backend.controller.destination;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.service.DestinationService;
import com.example.travel_backend.mapper.AreaCodeMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "관광지 정보 호출", description = "관광지 정보 호출이 가능합니다.")
@RestController // json, xml 형식으로 데이터 반환
public class DestinationController {
    private final DestinationService destinationService; // destination 컨트롤러에서 사용하는 객체

    @Autowired
    public DestinationController(DestinationService destinationService) { // 의존성 주입
        this.destinationService = destinationService;
    }

    @Operation(summary = "관광 데이터 호출", description = "모든 관광 데이터들을 호출합니다.")
    @GetMapping("/destination/All")
    public List<TourDTO> allDestination() {
        return destinationService.getAllDestinations();
    }

    @Operation(summary = "지역 별 관광 데이터 호출", description = "지역명 입력 후, 원하는 데이터 개수와 페이지 수를 입력하면." +
            "해당 지역에 맞는 관광 데이터 호출이 가능합니다.\n" +
            "예시:\n" +
            "seoul\n" +
            "incheon\n" +
            "daejeon\n" +
            "daegu\n" +
            "gwangju\n" +
            "busan\n" +
            "ulsan\n" +
            "sejong\n" +
            "gyeonggido\n" +
            "gangwondo")
    @GetMapping("/destination/location")
    public List<TourMainDTO> getDestinationsByLocation(@RequestParam String areaName,
                                                       @RequestParam int count,
                                                       @RequestParam int page) {
        String areaCode = AreaCodeMapper.getAreaCode(areaName);
        if ("unknown area code".equals(areaCode)) {
            throw new IllegalArgumentException("Invalid area name: " + areaName);
        }
        page = page * count; // OFFSET 계산
        return destinationService.getDestinationsByLocation(areaCode, count, page);
    }

    @Operation(summary = "해당 content_id 관광 데이터 호출", description = "content_id 입력 후 호출")
    @GetMapping("/destination/contentId")
    public List<TourDTO> getDestinationsByContentId(@RequestParam String contentId) {
        return destinationService.getDestinationsByContentId(contentId);
    }
}

//    @Operation(summary = "부산 관광 데이터 호출", description = "부산 10개의 관광 데이터들을 호출합니다.")
//    @GetMapping("/destination/busan")
//    public List<TourMainDTO> DestinationsBusan() {
//        return destinationService.getDestinationsByLocation("6", 10);
//    }
