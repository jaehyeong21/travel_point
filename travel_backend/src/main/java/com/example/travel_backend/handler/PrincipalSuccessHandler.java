package com.example.travel_backend.handler;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@Component
public class PrincipalSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PrincipalSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("userImgUrl", principalDetails.getMember().getUserImgUrl());
        userMap.put("id", principalDetails.getMember().getId());
        userMap.put("email", principalDetails.getMember().getEmail());
        userMap.put("createDate", principalDetails.getMember().getCreateDate().getTime());
        userMap.put("username", principalDetails.getMember().getUsername());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        ApiResponse apiResponse = ApiResponse.success(result);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}