package com.example.travel_backend.controller.theme;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.data.TourMainDTO;
import com.example.travel_backend.mapper.AreaCodeMapper;
import com.example.travel_backend.mapper.ThemeMapper;
import com.example.travel_backend.service.ThemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "테마 정보 호출", description = "테마 정보 호출이 가능합니다.")
@RestController
public class ThemeController {
    private final ThemeService themeService;

    @Autowired
    public ThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    @Operation(summary = "테마 데이터 호출", description = "테마별 데이터들을 호출합니다.")
    @GetMapping("/theme/type")
    public List<TourMainDTO> getTypeTheme(@RequestParam(required = false) String areaName,
                                          @RequestParam int count,
                                          @RequestParam int page,
                                          @RequestParam(required = false) String cat1,
                                          @RequestParam(required = false) String cat2,
                                          @RequestParam(required = false) String cat3) {
        validateParams(cat1, cat2, cat3);
        return themeService.getThemes(areaName, count, page, cat1, cat2, cat3);
    }

    private void validateParams(String cat1, String cat2, String cat3) {
        if (cat2 != null && cat1 == null) {
            throw new IllegalArgumentException("cat1이 없으면 cat2를 입력할 수 없습니다.");
        }
        if (cat3 != null && (cat1 == null || cat2 == null)) {
            throw new IllegalArgumentException("cat1과 cat2가 없으면 cat3을 입력할 수 없습니다.");
        }
    }

    @Operation(summary = "해당 content_id 테마 데이터 호출", description  = "content_id 입력 후 호출")
    @GetMapping("/theme/contentId")
    public TourDTO getContentIdTheme(@RequestParam String contentId) {
        return themeService.getThemesByContentId(contentId);
    }

}
