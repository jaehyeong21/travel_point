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
import org.springframework.security.authentication.BadCredentialsException;
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
    private final ReviewService reviewService;
    private final ReportService reportService;

    @Transactional
    public ApiResponse login(String email, String password, HttpServletResponse response) {
        try {
            log.info("Attempting to authenticate user: {}", email);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

            Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);  // Secure 옵션 추가
            refreshTokenCookie.setPath("/");
            response.addCookie(refreshTokenCookie);

            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", jwtToken.getAccessToken()); // jwtToken이 제대로 초기화되었는지 확인합니다.

            return ApiResponse.success(result);
        } catch (BadCredentialsException e) {
            log.error("사용자 로그인 실패: {}", email);
            return ApiResponse.error("AUTH003", "유효하지 않은 자격 증명입니다."); // 적절한 오류 메시지를 반환합니다.
        } catch (Exception e) {
            log.error("로그인 중 오류 발생: {}", email, e);
            return ApiResponse.error("AUTH004", "로그인 중 오류가 발생했습니다."); // 기타 예외 처리를 추가합니다.
        }
    }

    @Transactional
    public ApiResponse signup(String email, String password, String verificationCode, HttpServletResponse response) {
        try{
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

            PrincipalDetails principalDetails = new PrincipalDetails(member);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
            JwtToken jwtToken = jwtTokenProvider.generateToken(authenticationToken);

            // refreshToken을 HttpOnly 쿠키에 저장
            Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);  // Secure 옵션 추가
            refreshTokenCookie.setPath("/");
            response.addCookie(refreshTokenCookie);

            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", jwtToken.getAccessToken()); // jwtToken이 제대로 초기화되었는지 확인합니다.

            return ApiResponse.success(result);
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생: {}", email, e);
            return ApiResponse.error("SIGNUP001", "회원가입 중 오류가 발생했습니다."); // 기타 예외 처리를 추가합니다.
        }

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

                PrincipalDetails principalDetails = new PrincipalDetails(member);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
                JwtToken newJwtToken = jwtTokenProvider.generateToken(authentication);

                Map<String, Object> result = new HashMap<>();
                result.put("accessToken", newJwtToken.getAccessToken());

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