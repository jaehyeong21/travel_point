package com.example.travel_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import okhttp3.OkHttpClient;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration //config 설정 클래스 표시
public class SwaggerConfig {
    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient();
    }

    @Bean
    public OpenAPI openAPI(){
        return new OpenAPI().addServersItem(new Server().url("/"))
                .info(new Info()
                .title("Travel_Point")
                .description("관광지 후기 리뷰")
                .version("1.0"));
    }

    @Bean
    public GroupedOpenApi TravelApi() {
        return GroupedOpenApi.builder()
                .group("관광지 API DB저장") //그룹 이름 설정
                .pathsToMatch("/getAll/*") // 그룹 안에 있는 api들이 어떤 경로인지 설정
                .packagesToScan("com.example.travel_backend.controller.tourapi") // 실제 경로에 매핑된 api파일 경로
                .build();
    }

    @Bean
    public GroupedOpenApi Destination() {
        return GroupedOpenApi.builder()
                .group("관광 정보") //그룹 이름 설정
                .pathsToMatch("/destination/*") // 그룹 안에 있는 api들이 어떤 경로인지 설정
                .packagesToScan("com.example.travel_backend.controller.destination") // 실제 경로에 매핑된 api파일 경로
                .build();
    }
}
