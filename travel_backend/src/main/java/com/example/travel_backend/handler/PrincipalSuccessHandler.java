package com.example.travel_backend.handler;

import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class PrincipalSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    public PrincipalSuccessHandler(JwtTokenProvider jwtTokenProvider, MemberRepository memberRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.memberRepository = memberRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        Map<String, Object> attributes = authToken.getPrincipal().getAttributes();

        log.info("Attributes received: {}", attributes);

        String email = extractEmail(attributes);
        log.info("Extracted email: {}", email);

        if (email == null || email.isEmpty()) {
            log.error("Email is null or empty. Attributes: {}", attributes);
            throw new IllegalArgumentException("Email is null or empty. Cannot proceed.");
        }

        Optional<Member> optionalMember = memberRepository.findByEmail(email);
        Member member;

        if (optionalMember.isPresent()) {
            member = optionalMember.get();
        } else {
            member = new Member();
            member.setEmail(email);
            member.setUsername((String) attributes.get("name"));
            member.setUserImgUrl((String) attributes.get("profile_image"));
            memberRepository.save(member);
        }

        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        log.info("Generated access token: {}", jwtToken.getAccessToken());
        log.info("Generated refresh token: {}", jwtToken.getRefreshToken());

        // Refresh Token을 HttpOnly 쿠키에 저장
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setDomain("travel-point-umber.vercel.app");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        refreshTokenCookie.setAttribute("SameSite", "None");

        response.addCookie(refreshTokenCookie);
        log.info("PrincipalSuccessHandler setDomain :" + refreshTokenCookie.getDomain());
        log.info("PrincipalSuccessHandler - Refresh token cookie created and added to response for user: {}", email);

        response.sendRedirect("https://travel-point-umber.vercel.app/oauth-success?token=" + jwtToken.getAccessToken());
    }

    private String extractEmail(Map<String, Object> attributes) {
        if (attributes.containsKey("email")) {
            return (String) attributes.get("email");
        } else if (attributes.containsKey("response") && ((Map<String, Object>) attributes.get("response")).containsKey("email")) {
            return (String) ((Map<String, Object>) attributes.get("response")).get("email");
        }
        return null;
    }
}