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
                .group("관광 정보")
                .pathsToMatch("/destination/*")
                .packagesToScan("com.example.travel_backend.controller.destination")
                .build();
    }

    @Bean
    public GroupedOpenApi Festival() {
        return GroupedOpenApi.builder()
                .group("축제 정보")
                .pathsToMatch("/festival/*")
                .packagesToScan("com.example.travel_backend.controller.festival")
                .build();
    }

    @Bean
    public GroupedOpenApi Theme() {
        return GroupedOpenApi.builder()
                .group("테마 정보")
                .pathsToMatch("/theme/*")
                .packagesToScan("com.example.travel_backend.controller.theme")
                .build();
    }

    @Bean
    public GroupedOpenApi Cloud() {
        return GroupedOpenApi.builder()
                .group("이미지 업로드")
                .pathsToMatch("/cloudImages/*")
                .packagesToScan("com.example.travel_backend.controller.cloudImages")
                .build();
    }

    @Bean
    public GroupedOpenApi Login() {
        return GroupedOpenApi.builder()
                .group("로그인 및 회원정보관리")
                .pathsToMatch("/login/*")
                .packagesToScan("com.example.travel_backend.controller.login")
                .build();
    }

    @Bean
    public GroupedOpenApi Email() {
        return GroupedOpenApi.builder()
                .group("이메일 인증")
                .pathsToMatch("/mail/*")
                .packagesToScan("com.example.travel_backend.controller.mail")
                .build();
    }

    @Bean
    public GroupedOpenApi PasswordReset() {
        return GroupedOpenApi.builder()
                .group("비밀번호 관리")
                .pathsToMatch("/password/*")
                .packagesToScan("com.example.travel_backend.controller.password")
                .build();
    }

    @Bean
    public GroupedOpenApi Member() {
        return GroupedOpenApi.builder()
                .group("개인정보 관리")
                .pathsToMatch("/member/*")
                .packagesToScan("com.example.travel_backend.controller.member")
                .build();
    }

    @Bean
    public GroupedOpenApi Favorite() {
        return GroupedOpenApi.builder()
                .group("찜목록 관리")
                .pathsToMatch("/favorite/*")
                .packagesToScan("com.example.travel_backend.controller.favorite")
                .build();
    }

    @Bean
    public GroupedOpenApi Review() {
        return GroupedOpenApi.builder()
                .group("리뷰 관리")
                .pathsToMatch("/review/*")
                .packagesToScan("com.example.travel_backend.controller.review")
                .build();
    }

    @Bean
    public GroupedOpenApi ReviewLike() {
        return GroupedOpenApi.builder()
                .group("리뷰 좋아요 관리")
                .pathsToMatch("/like/*")
                .packagesToScan("com.example.travel_backend.controller.like")
                .build();
    }

    @Bean
    public GroupedOpenApi Report() {
        return GroupedOpenApi.builder()
                .group("신고 관리")
                .pathsToMatch("/report/*")
                .packagesToScan("com.example.travel_backend.controller.report")
                .build();
    }

}
