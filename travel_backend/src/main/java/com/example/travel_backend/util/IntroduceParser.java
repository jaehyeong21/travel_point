package com.example.travel_backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class IntroduceParser {
    public static String parseParkingFromResponse(String responseData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // JSON 문자열을 JsonNode 객체로 파싱
            JsonNode rootNode = objectMapper.readTree(responseData);
            JsonNode bodyNode = rootNode.get("response").get("body");
            if (bodyNode != null) {
                JsonNode itemsNode = bodyNode.get("items");
                if (itemsNode != null) {
                    JsonNode itemNode = itemsNode.get("item");
                    if (itemNode != null && itemNode.isArray()) { // item이 배열일 경우에만 반복
                        for (JsonNode item : itemNode) { // 각 item을 반복하면서 description 값을 가져옴
                            JsonNode overviewNode = item.get("parking");
                            if (overviewNode != null) {
                                return overviewNode.asText();
                            }
                        }
                    }
                }
            }
            System.out.println("응답 데이터에서 overview를 찾을 수 없습니다.");
            return null;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            System.out.println("JSON 파싱 중 오류가 발생했습니다.");
            return null;
        }
    }

    public static String parseUseTimeFromResponse(String responseData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // JSON 문자열을 JsonNode 객체로 파싱
            JsonNode rootNode = objectMapper.readTree(responseData);
            JsonNode bodyNode = rootNode.get("response").get("body");
            if (bodyNode != null) {
                JsonNode itemsNode = bodyNode.get("items");
                if (itemsNode != null) {
                    JsonNode itemNode = itemsNode.get("item");
                    if (itemNode != null && itemNode.isArray()) { // item이 배열일 경우에만 반복
                        for (JsonNode item : itemNode) { // 각 item을 반복하면서 homepage 값을 가져옴
                            JsonNode homepageNode = item.get("usetime");
                            if (homepageNode != null) {
                                return homepageNode.asText();
                            }
                        }
                    }
                }
            }
            System.out.println("응답 데이터에서 homepage를 찾을 수 없습니다.");
            return null;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            System.out.println("JSON 파싱 중 오류가 발생했습니다.");
            return null;
        }
    }

    public static String parseHolidayFromResponse(String responseData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // JSON 문자열을 JsonNode 객체로 파싱
            JsonNode rootNode = objectMapper.readTree(responseData);
            JsonNode bodyNode = rootNode.get("response").get("body");
            if (bodyNode != null) {
                JsonNode itemsNode = bodyNode.get("items");
                if (itemsNode != null) {
                    JsonNode itemNode = itemsNode.get("item");
                    if (itemNode != null && itemNode.isArray()) { // item이 배열일 경우에만 반복
                        for (JsonNode item : itemNode) { // 각 item을 반복하면서 homepage 값을 가져옴
                            JsonNode homepageNode = item.get("restdate");
                            if (homepageNode != null) {
                                return homepageNode.asText();
                            }
                        }
                    }
                }
            }
            System.out.println("응답 데이터에서 homepage를 찾을 수 없습니다.");
            return null;
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            System.out.println("JSON 파싱 중 오류가 발생했습니다.");
            return null;
        }
    }
}
