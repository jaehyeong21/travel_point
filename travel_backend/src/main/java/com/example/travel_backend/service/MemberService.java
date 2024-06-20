package com.example.travel_backend.service;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.PasswordChangeDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.validator.PasswordValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public JwtToken login(String email, String password) {
        // 1. username + password 를 기반으로 Authentication 객체 생성
        // 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);

        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        // authenticate 메서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
        return jwtToken;
    }

    //이메일로 비밀번호 찾기 -> 비밀번호 변경
    @Transactional
    public ApiResponse resetPassword(String email, String verificationCode, String newPassword) {
        String storedVerificationCode = mailService.getStoredVerificationCode(email);

        if (storedVerificationCode == null || !storedVerificationCode.equals(verificationCode)) {
            return ApiResponse.error("VerificationError", "Invalid verification code.");
        }

        Optional<Member> optionalMember = memberRepository.findByEmail(email);

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            // 새로운 비밀번호 인코딩
            String encodedPassword = passwordEncoder.encode(newPassword);

            // 기존 비밀번호와 새로운 비밀번호가 동일한지 확인
            if (passwordEncoder.matches(newPassword, member.getPassword())) {
                return ApiResponse.error("PasswordError", "New password must be different from the current password.");
            }

            // 비밀번호 설정
            member.setPassword(encodedPassword);

            // 회원 저장
            memberRepository.save(member);

            return ApiResponse.success("Password reset successfully.");
        } else {
            return ApiResponse.error("MemberError", "Member not found.");
        }
    }


    // 계정을 삭제
    @Transactional
    public ApiResponse deleteAccount(String passwordJson, String accessToken) {
        try {
            // JSON 문자열을 Map<String, String> 객체로 변환합니다.
            Map<String, String> passwordMap = objectMapper.readValue(passwordJson, Map.class);

            // Map에서 password 키에 해당하는 값을 추출합니다.
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

            // 회원의 모든 찜 목록 삭제
            favoritesService.deleteAllFavoritesByMemberId(member.getId());

            // 회원 삭제
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


    //로그인 한 상태에서 비밀번호 변경
    @Transactional
    public ApiResponse changePassword(PasswordChangeDto passwordChangeDto, String accessToken) {
        try {
            String currentPassword = passwordChangeDto.getCurrentPassword();
            String newPassword = passwordChangeDto.getNewPassword();

            // Validate new password format
            if (!PasswordValidator.isValid(newPassword)) {
                return ApiResponse.error("PasswordError", "Invalid password format.");
            }

            String email = jwtTokenProvider.getUsernameFromToken(accessToken);
            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            if (!memberOptional.isPresent()) {
                return ApiResponse.error("AUTH001", "Invalid Email");
            }

            Member member = memberOptional.get();

            //입력받은 비밀번호가 회원의 비밀번호와 일치하는지 검증
            if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
                return ApiResponse.error("AUTH002", "Invalid current password");
            }

            //패스워드 검증
            if (!PasswordValidator.isValid(newPassword)) {
                return ApiResponse.error("PasswordError", "Invalid new password format.");
            }

            // 기존 비밀번호와 새로운 비밀번호가 동일하지 않은지 확인
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
            // JWT 토큰에서 이메일 추출
            String email = jwtTokenProvider.getUsernameFromToken(accessToken);

            // 이메일로 회원 조회
            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            if (memberOptional.isPresent()) {
                Member member = memberOptional.get();

                // 이미지 URL 업데이트
                String imageUrl = imageMap.get("imageUrl");
                member.setUserImgUrl(imageUrl);
                memberRepository.save(member);

                // 맵을 생성할 때 null 값이 있는지 확인
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("userImgUrl", member.getUserImgUrl() != null ? member.getUserImgUrl() : "defaultImgUrl");
                userMap.put("id", member.getId());
                userMap.put("email", member.getEmail() != null ? member.getEmail() : "defaultEmail");
                userMap.put("createDate", member.getCreateDate() != null ? member.getCreateDate() : "defaultDate");
                userMap.put("username", member.getUsername() != null ? member.getUsername() : "defaultUsername");

                return ApiResponse.success(Map.of("user", userMap));
            } else {
                return ApiResponse.error("MemberError", "Member not found.");
            }
        } catch (Exception e) {
            log.error("Error uploading image", e);
            return ApiResponse.error("ServerError", "Failed to upload image: " + e.getMessage());
        }
    }

}