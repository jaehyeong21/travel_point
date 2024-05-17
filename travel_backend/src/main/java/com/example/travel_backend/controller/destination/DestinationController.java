package com.example.travel_backend.controller.destination;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.mapper.TourMapper;
import com.example.travel_backend.service.DestinationService;
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
    private final DestinationService destinationService; //destination 컨트롤러에서 사용하는 객체

    @Autowired
    public DestinationController(DestinationService destinationService) { // 의존성 주입?
        this.destinationService = destinationService;
    }

    @Operation(summary = "관광 데이터 호출", description = "모든 관광 데이터들을 호출합니다.")
    @GetMapping("/destination/")
    public List<TourDTO> allDestination() {
        return destinationService.getAllDestinations();
    }

    @Operation(summary = "관광 데이터 호출", description = "지역 코드 입력 후, 원하는 데이터 개수를 입력하면." +
            "해당 지역에 맞는 관광 데이터 호출이 가능합니다.\n" +
            "1. 서울\n" +
            "2. 인천\n" +
            "3. 대전\n" +
            "4. 대구\n" +
            "5. 광주\n" +
            "6. 부산\n" +
            "7. 울산\n" +
            "8. 세종\n" +
            "9. 경기도\n" +
            "10. 강원도 ㅎㅎ")
    @GetMapping("/destination/seoul")
    public List<TourMainDTO> DestinationsSeoul(@RequestParam String areaCode, @RequestParam int limit) {
        return destinationService.getDestinationsByLocation(areaCode, limit);
    }

//    @Operation(summary = "부산 관광 데이터 호출", description = "부산 10개의 관광 데이터들을 호출합니다.")
//    @GetMapping("/destination/busan")
//    public List<TourMainDTO> DestinationsBusan() {
//        return destinationService.getDestinationsByLocation("6", 10);
//    }
}
