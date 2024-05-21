package com.example.travel_backend.controller.tourapi;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.travel_backend.service.TravelApiService;

import java.util.List;

@Tag(name = "Destination save-to-db", description = "-----------사용금지-----------.")
@RestController
public class TravelApiController {

    private final TravelApiService travelApiService;

    @Value("${travel.api.key}")
    private String serviceKey;

    @Autowired
    public TravelApiController(TravelApiService travelApiService) {
        this.travelApiService = travelApiService; //다른 객체에서 생성하기 위한 방법
    }

    @Operation(summary = "관광 데이터 저장", description = "관광 데이터를 DB에 저장합니다.")
    @GetMapping("/getAll/")
    public String saveToDb() { // 관광 데이터
        String apiUrl = "https://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=40000&serviceKey=" + serviceKey +
                        "&MobileOS=ETC&MobileApp=travelPoint&_type=json&contentTypeId=28";
        travelApiService.saveDataToDb(apiUrl);
        return "Data saved to database successfully!";
    }

    @Operation(summary = "All Content_id", description = "내가 저장한 DB 전체 content_id를 불러옵니다.")
    @GetMapping("/getAll/content-ids")
    public List<String> getAllContentIds() {
        return travelApiService.getAllContentIdsFromDb();
    }

    @Operation(summary = "HomePage, descriptions update", description = "DB에 저장된 관광 데이터 기준 홈페이지, 설명 업데이트")
    @GetMapping("/getAll/update-all-descriptions") // 홈페이지 링크, 관광지 descriptions 업데이트
    public String updateAllDesAndHomePageToDb() {
        travelApiService.updateAllDesAndHomePageToDb();
        return "All descriptions updated successfully!";
    }

    @Operation(summary = "Holiday, useTime, parking update", description = "DB에 저장된 관광 데이터 기준 공휴일, 이용 시간, 주차시설 업데이트")
    @GetMapping("/getAll/update-all-introduce-informatin") // 공휴일, 이용 시간, 주차시설 업데이트
    public String updateAllIntroduceInformationToDb() {
        travelApiService.updateAllIntroduceToDb();
        return "updated all introduce information successfully!";
    }

    @Operation(summary = "image update", description = "DB에 저장된 관광 데이터 기준 이미지 업데이트")
    @GetMapping("/getAll/update-all-image") // 공휴일, 이용 시간, 주차시설 업데이트
    public String updateAllImageToDb() {
        travelApiService.updateAllImageToDb();
        return "updated all image information successfully!";
    }

    @Operation(summary = "content_id에 매핑된 area_code 업데이트", description = "content_id에 매핑된 area_code를 업데이트합니다.")
    @GetMapping("/update/area-code")
    public String updateAreaCode() {
        String apiUrl = "https://apis.data.go.kr/B551011/KorService1/areaBasedList1?numOfRows=40000&serviceKey=" + serviceKey +
                "&MobileOS=ETC&MobileApp=travelPoint&_type=json&contentTypeId=12";
        travelApiService.updateAreaCode(apiUrl);
        return "Area code updated successfully!";
    }
}