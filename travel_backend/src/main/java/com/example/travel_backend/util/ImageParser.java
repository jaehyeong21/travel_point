package com.example.travel_backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ImageParser {
    public static List<String> parseImageUrlsFromResponse(String responseData) {
        List<String> imageUrls = new ArrayList<>();

        try {
            // ObjectMapper를 사용하여 JSON 문자열을 JsonNode로 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseData);

            // "item" 배열에 있는 각 요소에서 이미지 URL을 추출하여 리스트에 추가
            JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");
            Iterator<JsonNode> iterator = itemsNode.elements();
            while (iterator.hasNext()) {
                JsonNode itemNode = iterator.next();
                String originImgUrl = itemNode.path("originimgurl").asText();
                imageUrls.add(originImgUrl);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("JSON 파싱 중 오류가 발생했습니다.");
            return null;
        }

        return imageUrls;
    }
}