package com.example.travel_backend.mapper;

import java.util.HashMap;
import java.util.Map;

public class AreaCodeMapper {
    private static final Map<String, String> nameToAreaCode = new HashMap<>();
    private static final Map<String, String> areaCodeToName = new HashMap<>();

    static {
        areaCodeToName.put("1", "seoul");
        areaCodeToName.put("2", "incheon");
        areaCodeToName.put("3", "daejeon");
        areaCodeToName.put("4", "daegu");
        areaCodeToName.put("5", "gwangju");
        areaCodeToName.put("6", "busan");
        areaCodeToName.put("7", "ulsan");
        areaCodeToName.put("8", "sejong");
        areaCodeToName.put("9", "gyeonggido");
        areaCodeToName.put("10", "gangwondo");

        // 역 매핑
        for (Map.Entry<String, String> entry : areaCodeToName.entrySet()) {
            nameToAreaCode.put(entry.getValue(), entry.getKey());
        }
    }

    public static String getAreaName(String areaCode) {
        return areaCodeToName.getOrDefault(areaCode, "unknown area code");
    }

    public static String getAreaCode(String areaName) {
        return nameToAreaCode.getOrDefault(areaName.toLowerCase(), "unknown area code"); // "unknown area code"는 없는 지역 코드의 예시입니다.
    }
}