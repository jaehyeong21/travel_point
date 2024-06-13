package com.example.travel_backend.service;

import com.example.travel_backend.data.CloudImagesDTO;
import com.example.travel_backend.mapper.CloudImagesMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URL;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

@Service
public class CloudImagesService {

    @Autowired
    private CloudImagesMapper cloudImagesMapper;

    @Value("${cloudflare.api.url}") // yml 파일에서 가져옴
    private String apiUrl;

    @Value("${cloudflare.api.token}")
    private String apiToken;

    @Value("${cloudflare.api.accountHash}")
    private String accountHash;

    public void processImages() {
        List<CloudImagesDTO> allImages = cloudImagesMapper.getAllImages(); //db에서 모든 이미지 url 정보 가져옴
        if (allImages != null && !allImages.isEmpty()) {
            for (CloudImagesDTO image : allImages) { // 각 이미지 url 순회
                String contentId = image.getContentId();
                String firstimage = image.getFirstimage();

                if (firstimage == null || firstimage.isEmpty()) {
                    System.out.println("First image URL is missing for content ID: " + contentId);
                    continue;
                }

                String uploadedFirstImage = uploadAndBuildUrl(firstimage);
                String uploadedFirstImage2 = uploadAndBuildUrl(image.getFirstimage2());
                String uploadedFirstImage3 = uploadAndBuildUrl(image.getFirstimage3());
                String uploadedFirstImage4 = uploadAndBuildUrl(image.getFirstimage4());
                String uploadedFirstImage5 = uploadAndBuildUrl(image.getFirstimage5());

                cloudImagesMapper.updateImageUrls(contentId, uploadedFirstImage, uploadedFirstImage2, uploadedFirstImage3, uploadedFirstImage4, uploadedFirstImage5);
            }
        } else {
            System.out.println("No images found in the destination table");
        }
    }

    private String uploadAndBuildUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }
        String cloudflareImageId = uploadImageToCloudflare(imageUrl); //이미지를 Cloudflare에 업로드
        return cloudflareImageId != null ? buildBaseImageUrl(cloudflareImageId) : null;
    }

    private String uploadImageToCloudflare(String imageUrl) {
        String imageId = null;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost uploadRequest = new HttpPost(apiUrl); //HttpPost 객체를 생성하고, 요청 URL(apiUrl)을 지정
            uploadRequest.setHeader("Authorization", "Bearer " + apiToken);
            //요청 헤더에 인증 토큰을 설정
            URL url = new URL(imageUrl); // URL 객체를 생성
            InputStream imageStream = url.openStream(); // URL에서 이미지 스트림을 연다.

            MultipartEntityBuilder builder = MultipartEntityBuilder.create(); // 멀티파트 엔티티 빌더를 생성
            builder.addBinaryBody("file", imageStream, ContentType.DEFAULT_BINARY, "image.jpg");
            //  이미지 파일을 바이너리로 추가
            uploadRequest.setEntity(builder.build()); // 요청 엔티티를 설정

            HttpResponse response = httpClient.execute(uploadRequest); //요청을 실행하고 응답을 받는다.
            String responseString = EntityUtils.toString(response.getEntity()); // 응답 내용을 문자열로 변환
            System.out.println("Response from Cloudflare: " + responseString); // 응답을 출력

            imageId = extractImageIdFromResponse(responseString); // 응답에서 이미지 ID를 추출

        } catch (Exception e) {
            e.printStackTrace();
        }

        return imageId;
    }

    private String extractImageIdFromResponse(String responseString) {
        String imageId = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseString);
            imageId = rootNode.path("result").path("id").asText();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return imageId;
    }

    private String buildBaseImageUrl(String imageId) {
        return String.format("https://imagedelivery.net/%s/%s/", accountHash, imageId);
    }
}


