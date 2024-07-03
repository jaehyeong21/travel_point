package com.example.travel_backend.handler;

import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class PrincipalSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
//    private final ObjectMapper objectMapper = new ObjectMapper();

    private final MemberRepository memberRepository;

    public PrincipalSuccessHandler(JwtTokenProvider jwtTokenProvider, MemberRepository memberRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.memberRepository = memberRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        String email = authToken.getPrincipal().getAttribute("email");
        Member member = memberRepository.findByEmail(email).orElseGet(() -> {
            Member newMember = new Member();
            newMember.setEmail(email);
            newMember.setUsername(authToken.getPrincipal().getAttribute("name"));
            return memberRepository.save(newMember);
        });

        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        response.sendRedirect("https://travel-point-umber.vercel.app/oauth-success?token=" + jwtToken.getAccessToken());
    }
    /*
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        Map<String, Object> userMap = new HashMap<>();
        Map<String, Object> result = new HashMap<>();
        ApiResponse apiResponse = ApiResponse.success(result);

        result.put("user", userMap);
        result.put("token", jwtToken);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));

//        String redirectUrl = "http://localhost:3000/auth/callback?token=" + jwtToken.getAccessToken();
//        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
    */



}