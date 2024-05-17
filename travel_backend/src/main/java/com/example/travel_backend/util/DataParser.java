package com.example.travel_backend.util;

import com.example.travel_backend.data.TourDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

// json 형식의 데이터를 java 객체로 변환 해줘야 함
public class DataParser {
    public static List<TourDTO> parseResponse(String responseData) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<TourDTO> tourDTOList = new ArrayList<>();

        try {
            JsonNode rootNode = objectMapper.readTree(responseData);
            JsonNode bodyNode = rootNode.get("response").get("body");
            JsonNode itemsNode = bodyNode.get("items");
            JsonNode itemArrayNode = itemsNode.get("item");

            if (itemArrayNode.isArray()) {
                for (JsonNode itemNode : itemArrayNode) {
                    TourDTO tourDTO = new TourDTO();
                    tourDTO.setLocation(getTextOrNull(itemNode, "addr1"));
                    tourDTO.setCat1(getTextOrNull(itemNode, "cat1"));
                    tourDTO.setCat2(getTextOrNull(itemNode, "cat2"));
                    tourDTO.setCat3(getTextOrNull(itemNode, "cat3"));
                    tourDTO.setFirstImage(getTextOrNull(itemNode, "firstimage"));
                    tourDTO.setLocationNumber(getTextOrNull(itemNode, "sigungucode"));
                    tourDTO.setContentId(getTextOrNull(itemNode, "contentid"));
                    tourDTO.setContentTypeId(getTextOrNull(itemNode, "contenttypeid"));
                    tourDTO.setTitle(getTextOrNull(itemNode, "title"));
                    tourDTO.setMapX(getTextOrNull(itemNode, "mapx"));
                    tourDTO.setMapY(getTextOrNull(itemNode, "mapy"));
                    tourDTO.setTel(getTextOrNull(itemNode, "tel"));
                    tourDTOList.add(tourDTO);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return tourDTOList;
    }

    private static String getTextOrNull(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        return (fieldNode != null) ? fieldNode.asText() : null;
    }
}
