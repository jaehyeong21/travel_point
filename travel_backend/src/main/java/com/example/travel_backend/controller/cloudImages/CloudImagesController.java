package com.example.travel_backend.controller.cloudImages;

import com.example.travel_backend.service.CloudImagesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "클라우드 이미지 저장 및 db 저장", description = "url 저장")
@RestController
public class CloudImagesController {

    @Autowired
    private CloudImagesService cloudImagesService;

    @GetMapping("/process")
    public String processImages() {
        cloudImagesService.processImages();
        return "Image processing started";
    }

    @GetMapping("/retry-failed-uploads")
    public String retryFailedUploads() {
        cloudImagesService.processFailedUploads();
        return "Retrying failed uploads started";
    }
}