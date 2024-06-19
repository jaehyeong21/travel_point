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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

@Service
public class CloudImagesService {

    @Autowired
    private CloudImagesMapper cloudImagesMapper;

    @Value("${cloudflare.api.url}")
    private String apiUrl;

    @Value("${cloudflare.api.token}")
    private String apiToken;

    @Value("${cloudflare.api.accountHash}")
    private String accountHash;

    public void processImages() {
        List<CloudImagesDTO> allImages = cloudImagesMapper.getAllImages();
        if (allImages != null && !allImages.isEmpty()) {
            for (CloudImagesDTO image : allImages) {
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

    public void processFailedUploads() {
        List<CloudImagesDTO> failedImages = cloudImagesMapper.getFailedImages();

        List<CloudImagesDTO> backupImages = cloudImagesMapper.getBackupImagesByIds(
                failedImages.stream().map(CloudImagesDTO::getContentId).collect(Collectors.toList())
        );

        Map<String, CloudImagesDTO> backupImagesMap = new HashMap<>();
        for (CloudImagesDTO image : backupImages) {
            backupImagesMap.put(image.getContentId(), image);
        }

        for (CloudImagesDTO failedImage : failedImages) {
            String contentId = failedImage.getContentId();
            CloudImagesDTO backupImage = backupImagesMap.get(contentId);

            if (backupImage != null) {
                String uploadedFirstImage = checkAndReuploadImage(backupImage.getFirstimage(), failedImage.getFirstimage());
                String uploadedFirstImage2 = checkAndReuploadImage(backupImage.getFirstimage2(), failedImage.getFirstimage2());
                String uploadedFirstImage3 = checkAndReuploadImage(backupImage.getFirstimage3(), failedImage.getFirstimage3());
                String uploadedFirstImage4 = checkAndReuploadImage(backupImage.getFirstimage4(), failedImage.getFirstimage4());
                String uploadedFirstImage5 = checkAndReuploadImage(backupImage.getFirstimage5(), failedImage.getFirstimage5());

                cloudImagesMapper.updateImageUrls(contentId, uploadedFirstImage, uploadedFirstImage2, uploadedFirstImage3, uploadedFirstImage4, uploadedFirstImage5);
            }
        }
    }

    private String checkAndReuploadImage(String backupUrl, String failedUrl) {
        if (failedUrl == null || failedUrl.isEmpty() || failedUrl.endsWith("/")) {
            return uploadAndBuildUrl(backupUrl);
        }
        return failedUrl;
    }

    private String uploadAndBuildUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }
        String cloudflareImageId = uploadImageToCloudflare(imageUrl);
        return cloudflareImageId != null ? buildBaseImageUrl(cloudflareImageId) : null;
    }

    private String uploadImageToCloudflare(String imageUrl) {
        String imageId = null;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost uploadRequest = new HttpPost(apiUrl);
            uploadRequest.setHeader("Authorization", "Bearer " + apiToken);

            URL url = new URL(imageUrl);
            BufferedImage bufferedImage = ImageIO.read(url);
            if (bufferedImage == null) {
                System.out.println("Failed to read image: " + imageUrl);
                return null;
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "jpg", baos);
            byte[] imageBytes = baos.toByteArray();

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody("file", imageBytes, ContentType.IMAGE_JPEG, "image.jpg");
            uploadRequest.setEntity(builder.build());

            HttpResponse response = httpClient.execute(uploadRequest);
            String responseString = EntityUtils.toString(response.getEntity());
            System.out.println("Response from Cloudflare: " + responseString);

            imageId = extractImageIdFromResponse(responseString);

        } catch (IOException e) {
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



