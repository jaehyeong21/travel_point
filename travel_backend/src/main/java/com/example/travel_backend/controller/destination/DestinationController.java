package com.example.travel_backend.controller.destination;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.data.TourNearbyDTO;
import com.example.travel_backend.data.TourTitleDTO;
import com.example.travel_backend.service.DestinationService;
import com.example.travel_backend.mapper.AreaCodeMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Operation(summary = "주변 관광 데이터 호출",description = "주변 관광 데이터들을 호출합니다.")
    @GetMapping("/destination/nearby")
    public List<TourNearbyDTO> DestinationByNearby(@RequestParam String latitude, @RequestParam String longitude ) {
        return destinationService.getDestinationByNearby(latitude, longitude);
    }

    @Operation(summary = "제목 , contentId 호출(축제 데이터 제외)", description = "제목과 content_id만 호출합니다")
    @GetMapping("/destination/title")
    public List<TourTitleDTO> DestinationByTitle() {
        return destinationService.getAllDestinationsTitle();
    }

    @Operation(summary = "지역 별 관광 데이터 호출", description = "지역명 입력 후, 원하는 데이터 개수와 페이지 수를 입력하면 해당 지역에 맞는 관광 데이터 호출이 가능합니다.\n" +
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
            "gangwondo\n" +
            "chungbuk\n" +
            "chungnam\n" +
            "gyeongbuk\n" +
            "jeonbuk\n" +
            "jeonnam\n" +
            "jeju")
    @GetMapping("/destination/location")
    public Map<String, Object> getDestinationsByLocation(@RequestParam(required = false) String areaName,
                                                         @RequestParam int count,
                                                         @RequestParam int page) {
        String areaCode = null;
        if (areaName != null) {
            areaCode = AreaCodeMapper.getAreaCode(areaName);
            if ("unknown area code".equals(areaCode)) {
                throw new IllegalArgumentException("Invalid area name: " + areaName);
            }
        }

        int totalData = destinationService.countDestinationsByLocation(areaCode);
        int totalPages = (int) Math.ceil((double) totalData / count);
        int offset = (page - 1) * count;

        List<TourMainDTO> destinations = destinationService.getDestinationsByLocation(areaCode, count, offset);

        Map<String, Object> response = new HashMap<>();
        response.put("totalData", totalData);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);
        response.put("destinations", destinations);

        return response;
    }

    @Operation(summary = "해당 content_id 관광 데이터 호출", description = "content_id 입력 후 호출")
    @GetMapping("/destination/contentId")
    public Object getDestinationsByContentId(@RequestParam String contentId,
                                             @RequestParam(required = false) String contentTypeId) {
        return destinationService.getDestinationsByContentId(contentId, contentTypeId);
    }

}


//    @Operation(summary = "부산 관광 데이터 호출", description = "부산 10개의 관광 데이터들을 호출합니다.")
//    @GetMapping("/destination/busan")
//    public List<TourMainDTO> DestinationsBusan() {
//        return destinationService.getDestinationsByLocation("6", 10);
//    }
