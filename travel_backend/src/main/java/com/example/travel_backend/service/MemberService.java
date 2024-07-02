package com.example.travel_backend.service;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.PasswordChangeDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.validator.EmailValidator;
import com.example.travel_backend.validator.PasswordValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class MemberService {
    private final MemberRepository memberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final FavoritesService favoritesService;

    @Transactional
    public ApiResponse login(String email, String password, HttpServletResponse response) {
        // 1. username + password 를 기반으로 Authentication 객체 생성
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);

        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        // 4. refreshToken을 HttpOnly 쿠키에 저장
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", jwtToken.getAccessToken());

        return ApiResponse.success(result);
    }

    @Transactional
    public ApiResponse signup(String email, String password, String verificationCode) {
        if (!EmailValidator.isValidEmail(email)) {
            return ApiResponse.error("EmailError", "Invalid Email Format");
        }

        if (memberRepository.findByEmail(email).isPresent()) {
            return ApiResponse.error("EmailExists", "This email is already registered");
        }

        if (!PasswordValidator.isValid(password)) {
            return ApiResponse.error("PasswordError", "Invalid Password Format");
        }

        String storedVerificationCode = mailService.getStoredVerificationCode(email);

        if (!verificationCode.equals(storedVerificationCode)) {
            return ApiResponse.error("VerificationError", "Invalid Verification Code");
        }

        String encPassword = passwordEncoder.encode(password);

        Member member = new Member();
        member.setEmail(email);
        member.setPassword(encPassword);
        member.setRole("USER");
        memberRepository.save(member);

        JwtToken jwtToken = jwtTokenProvider.generateToken(new UsernamePasswordAuthenticationToken(email, password));

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", member.getId());
        userMap.put("createDate", member.getCreateDate());
        userMap.put("username", member.getUsername());
        userMap.put("userImgUrl", member.getUserImgUrl());
        userMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        return ApiResponse.success(result);
    }

    @Transactional
    public ApiResponse resetPassword(String email, String verificationCode, String newPassword) {
        String storedVerificationCode = mailService.getStoredVerificationCode(email);

        if (storedVerificationCode == null || !storedVerificationCode.equals(verificationCode)) {
            return ApiResponse.error("VerificationError", "Invalid verification code.");
        }

        Optional<Member> optionalMember = memberRepository.findByEmail(email);

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            String encodedPassword = passwordEncoder.encode(newPassword);

            if (passwordEncoder.matches(newPassword, member.getPassword())) {
                return ApiResponse.error("PasswordError", "New password must be different from the current password.");
            }

            member.setPassword(encodedPassword);

            memberRepository.save(member);

            return ApiResponse.success("Password reset successfully.");
        } else {
            return ApiResponse.error("MemberError", "Member not found.");
        }
    }

    @Transactional
    public ApiResponse deleteAccount(String passwordJson, String accessToken) {
        try {
            Map<String, String> passwordMap = objectMapper.readValue(passwordJson, Map.class);

            String password = passwordMap.get("password");

            String email = jwtTokenProvider.getUsernameFromToken(accessToken);
            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            if (!memberOptional.isPresent()) {
                return ApiResponse.error("AUTH001", "Invalid Email");
            }

            Member member = memberOptional.get();

            if (!passwordEncoder.matches(password, member.getPassword())) {
                return ApiResponse.error("AUTH002", "Invalid Password");
            }

            favoritesService.deleteAllFavoritesByMemberId(member.getId());
            memberRepository.delete(member);

            return ApiResponse.success("Account deleted successfully");
        } catch (IOException e) {
            log.error("Error parsing password JSON", e);
            return ApiResponse.error("ServerError", "Failed to parse password JSON: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting account", e);
            return ApiResponse.error("ServerError", "Failed to delete account: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse changePassword(PasswordChangeDto passwordChangeDto, String accessToken) {
        try {
            String currentPassword = passwordChangeDto.getCurrentPassword();
            String newPassword = passwordChangeDto.getNewPassword();

            if (!PasswordValidator.isValid(newPassword)) {
                return ApiResponse.error("PasswordError", "Invalid password format.");
            }

            String email = jwtTokenProvider.getUsernameFromToken(accessToken);
            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            if (!memberOptional.isPresent()) {
                return ApiResponse.error("AUTH001", "Invalid Email");
            }

            Member member = memberOptional.get();

            if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
                return ApiResponse.error("AUTH002", "Invalid current password");
            }

            if (!PasswordValidator.isValid(newPassword)) {
                return ApiResponse.error("PasswordError", "Invalid new password format.");
            }

            if (passwordEncoder.matches(newPassword, member.getPassword())) {
                return ApiResponse.error("PasswordError", "New password must be different from the current password.");
            }

            member.setPassword(passwordEncoder.encode(newPassword));
            memberRepository.save(member);

            return ApiResponse.success("Password changed successfully");
        } catch (Exception e) {
            log.error("Error changing password", e);
            return ApiResponse.error("ServerError", "Failed to change password: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse uploadImage(Map<String, String> imageMap, String accessToken) {
        try {
            String email = jwtTokenProvider.getUsernameFromToken(accessToken);

            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            if (memberOptional.isPresent()) {
                Member member = memberOptional.get();

                String imageUrl = imageMap.get("imageUrl");
                member.setUserImgUrl(imageUrl);
                memberRepository.save(member);

                // 새로운 accessToken을 생성
                Authentication authentication = new UsernamePasswordAuthenticationToken(member.getEmail(), null, new PrincipalDetails(member).getAuthorities());
                JwtToken newJwtToken = jwtTokenProvider.generateToken(authentication);

                Map<String, Object> userMap = new HashMap<>();
                userMap.put("userImgUrl", member.getUserImgUrl() != null ? member.getUserImgUrl() : "defaultImgUrl");
                userMap.put("id", member.getId());
                userMap.put("email", member.getEmail() != null ? member.getEmail() : "defaultEmail");
                userMap.put("createDate", member.getCreateDate() != null ? member.getCreateDate() : "defaultDate");
                userMap.put("username", member.getUsername() != null ? member.getUsername() : "defaultUsername");

                Map<String, Object> result = new HashMap<>();
                result.put("user", userMap);
                result.put("token", newJwtToken); // 새로운 JWT 토큰 추가

                return ApiResponse.success(result);
            } else {
                return ApiResponse.error("MemberError", "Member not found.");
            }
        } catch (Exception e) {
            log.error("Error uploading image", e);
            return ApiResponse.error("ServerError", "Failed to upload image: " + e.getMessage());
        }
    }
}