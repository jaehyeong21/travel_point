package com.example.travel_backend.service;

import com.example.travel_backend.data.TourDTO;
import com.example.travel_backend.mapper.TourMapper;
import com.example.travel_backend.util.DataParser;
import com.example.travel_backend.util.DesHome;
import com.example.travel_backend.util.ImageParser;
import com.example.travel_backend.util.IntroduceParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TravelApiService {

    @Value("${travel.api.key}")
    private String serviceKey;

    private final OkHttpClient client;
    private final TourMapper tourMapper;

    @Autowired
    public TravelApiService(OkHttpClient client, TourMapper tourMapper) {
        this.client = client;
        this.tourMapper = tourMapper;
    }

    public void saveDataToDb(String apiUrl) { //관광 데이터 저장
        Request request = new Request.Builder()
                .url(apiUrl)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                // 실패 응답 처리
                System.out.println("API 호출 실패");
                return;
            }
            String responseData = response.body().string();
            // 응답 데이터를 파싱하여 TourDTO 객체 리스트로 변환
            List<TourDTO> tourDTOList = DataParser.parseResponse(responseData);
            // DB에 저장
            if (tourDTOList != null && !tourDTOList.isEmpty()) {
                for (TourDTO tourDTO : tourDTOList) {
                    tourMapper.insertTourDTO(tourDTO);
                }
            } else {
                System.out.println("파싱된 데이터가 없습니다.");
            }
        } catch (IOException e) {
            // 예외 처리
            e.printStackTrace();
            System.out.println("API 호출 중 오류 발생");
        }
    }

    public void updateAllDesAndHomePageToDb() {
        List<String> allContentIds = getAllContentIdsFromDb();
        for (String contentId : allContentIds) {
            updateDesAndHomePageToDb(contentId);
        }
    }

    public void updateAllIntroduceToDb() {
        List<String> allContentIds = getAllContentIdsFromDb();
        for (String contentId : allContentIds) {
            updateIntroduceToDb(contentId);
        }
    }

    public void updateAllImageToDb() {
        List<String> allContentIds = getAllContentIdsFromDb();
        for (String contentId : allContentIds) {
            updateImageToDb(contentId);
        }
    }

    //content id 반환
    public List<String> getAllContentIdsFromDb() { // 관광 content_id 조회
        return tourMapper.getAllContentIds();
    }

    //description, homepage 업데이트
    public void updateDesAndHomePageToDb(String contentId) {
        String apiUrl = "http://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=" + serviceKey +
                "&contentId=" + contentId + "&defaultYN=Y&addrinfoYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTest&_type=json";

        boolean success = false;
        int retryCount = 0;
        final int MAX_RETRY_COUNT = 3;
        final long RETRY_INTERVAL = 30000; // 30 seconds

        while (!success && retryCount < MAX_RETRY_COUNT) {
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    // 실패 응답 처리
                    System.out.println("API 호출 실패");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL); // 재시도 간격 대기
                    continue;
                }
                String responseData = response.body().string();

                // 서비스 오류 메시지인지 확인
                if (isServiceErrorMessage(responseData)) {
                    System.out.println("서비스 오류 메시지를 받았습니다. 30초 후 다시 시도합니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                    continue;
                }

                // 응답 데이터에서 description과 homepage 추출
                String description = DesHome.parseDescriptionFromResponse(responseData);
                String homepage = DesHome.parseHomepageFromResponse(responseData);
                // 데이터베이스 업데이트
                if (description != null && homepage != null) {
                    tourMapper.updateDescriptionAndHomepageByContentId(contentId, description, homepage);
                    System.out.println("Description and homepage updated successfully for content ID: " + contentId);
                    success = true;
                } else {
                    System.out.println("응답 데이터를 파싱하는 중 오류가 발생했습니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                }
            } catch (IOException e) {
                // 예외 처리
                e.printStackTrace();
                System.out.println("API 호출 중 오류 발생");
                retryCount++;
                try {
                    Thread.sleep(RETRY_INTERVAL);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                Thread.currentThread().interrupt();
            }
        }
    }

    public void updateIntroduceToDb(String contentId) {
        String apiUrl = "http://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=" + serviceKey +
                "&MobileOS=ETC&MobileApp=travelPoint&contentId=" + contentId + "&_type=json&contentTypeId=12";

        boolean success = false;
        int retryCount = 0;
        final int MAX_RETRY_COUNT = 3;
        final long RETRY_INTERVAL = 30000; // 30 seconds

        while (!success && retryCount < MAX_RETRY_COUNT) {
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    // 실패 응답 처리
                    System.out.println("API 호출 실패");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                    continue;
                }
                String responseData = response.body().string();

                // 서비스 오류 메시지인지 확인
                if (isServiceErrorMessage(responseData)) {
                    System.out.println("서비스 오류 메시지를 받았습니다. 30초 후 다시 시도합니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                    continue;
                }

                // 응답 데이터에서 description과 homepage 추출
                String parking = IntroduceParser.parseParkingFromResponse(responseData);
                String useTime = IntroduceParser.parseUseTimeFromResponse(responseData);
                String holiday = IntroduceParser.parseHolidayFromResponse(responseData);
                // 데이터베이스 업데이트
                if (parking != null && useTime != null && holiday != null) {
                    tourMapper.updateIntroduceByContentId(contentId, parking, useTime, holiday);
                    System.out.println("Description and homepage updated successfully for content ID: " + contentId);
                    success = true;
                } else {
                    System.out.println("응답 데이터를 파싱하는 중 오류가 발생했습니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                }
            } catch (IOException e) {
                // 예외 처리
                e.printStackTrace();
                System.out.println("API 호출 중 오류 발생");
                retryCount++;
                try {
                    Thread.sleep(RETRY_INTERVAL);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                Thread.currentThread().interrupt();
            }
        }
    }

    public void updateImageToDb(String contentId) {
        String apiUrl = "https://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=" + serviceKey +
                "&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=" + contentId + "&imageYN=Y&subImageYN=Y&_type=json";

        boolean success = false;
        int retryCount = 0;
        final int MAX_RETRY_COUNT = 3;
        final long RETRY_INTERVAL = 30000; // 30 seconds

        while (!success && retryCount < MAX_RETRY_COUNT) {
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    // 실패 응답 처리
                    System.out.println("API 호출 실패");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                    continue;
                }
                String responseData = response.body().string();

                // 서비스 오류 메시지인지 확인
                if (isServiceErrorMessage(responseData)) {
                    System.out.println("서비스 오류 메시지를 받았습니다. 30초 후 다시 시도합니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                    continue;
                }

                System.out.println(responseData);
                List<String> imageUrls = ImageParser.parseImageUrlsFromResponse(responseData);
                if (imageUrls != null) {
                    int numberOfImagesToUpdate = Math.min(imageUrls.size(), 4); // 최대 4개의 이미지만 업데이트
                    String image2 = numberOfImagesToUpdate > 0 ? imageUrls.get(0) : null;
                    String image3 = numberOfImagesToUpdate > 1 ? imageUrls.get(1) : null;
                    String image4 = numberOfImagesToUpdate > 2 ? imageUrls.get(2) : null;
                    String image5 = numberOfImagesToUpdate > 3 ? imageUrls.get(3) : null;
                    tourMapper.updateImageByContentId(contentId, image2, image3, image4, image5);
                    System.out.println("Description and homepage updated successfully for content ID: " + contentId);
                    success = true;
                } else {
                    System.out.println("응답 데이터를 파싱하는 중 오류가 발생했습니다.");
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                }
            } catch (IOException e) {
                // 예외 처리
                e.printStackTrace();
                System.out.println("API 호출 중 오류 발생");
                retryCount++;
                try {
                    Thread.sleep(RETRY_INTERVAL);
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                Thread.currentThread().interrupt();
            }
        }
    }

    public void updateAreaCode(String apiUrl) {
        List<TourDTO> tourDTOList = getDataFromApi(apiUrl);
        for (TourDTO tourDTO : tourDTOList) {
            tourMapper.updateAreaCodeByContentId(tourDTO.getContentId(), tourDTO.getAreaCode());
        }
    }

    public List<TourDTO> getDataFromApi(String apiUrl) {
        List<TourDTO> tourDTOList = new ArrayList<>();

        Request request = new Request.Builder()
                .url(apiUrl)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                System.out.println("API 호출 실패");
                return tourDTOList;
            }

            String responseData = response.body().string();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseData);

            JsonNode itemsNode = rootNode.path("response").path("body").path("items").path("item");
            for (JsonNode itemNode : itemsNode) {
                TourDTO tourDTO = new TourDTO();
                tourDTO.setContentId(itemNode.path("contentid").asText());
                tourDTO.setAreaCode(itemNode.path("areacode").asText());
                // 필요한 다른 속성들을 여기에 추가할 수 있습니다.

                tourDTOList.add(tourDTO);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("API 호출 중 오류 발생");
        }

        return tourDTOList;
    }


    // 서비스 오류 메시지인지 확인하는 메서드
    private boolean isServiceErrorMessage(String responseData) {
        return responseData.contains("<OpenAPI_ServiceResponse>") &&
                responseData.contains("<errMsg>SERVICE ERROR</errMsg>");
    }


}
