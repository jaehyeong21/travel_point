package com.example.travel_backend.controller.login;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.LoginDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.service.MailService;
import com.example.travel_backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController("loginController")
public class LoginController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MemberService memberService;

    @Autowired
    private MailService mailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/loginForm")
    public String loginForm() {
        // 로그인 폼 페이지로 이동
        return "loginForm";
    }

    @Operation(summary = "로그인", description = "사용자의 이메일 주소와 비밀번호로 로그인을 진행합니다.")
    @PostMapping("/loginForm")
    public ResponseEntity<ApiResponse> loginForm(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        ApiResponse apiResponse = memberService.login(loginDto.getEmail(), loginDto.getPassword(), response);
        return ResponseEntity.ok(apiResponse);
    }

    @Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 Access Token을 갱신합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    if (refreshToken != null && !refreshToken.trim().isEmpty()) {
                        try {
                            JwtToken newJwtToken = jwtTokenProvider.refreshToken(refreshToken);
                            log.debug("Generated new JWT token: {}", newJwtToken);
                            Map<String, Object> result = new HashMap<>();
                            result.put("accessToken", newJwtToken.getAccessToken());
                            return ResponseEntity.ok(ApiResponse.success(result));
                        } catch (RuntimeException e) {
                            log.error("Error refreshing token", e);
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("InvalidToken", "Refresh token is invalid or expired"));
                        }
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("InvalidRequest", "Refresh token is missing or empty"));
    }

    @Operation(summary = "회원가입 요청", description = "이메일과 비밀번호를 검증하고, 해당 이메일로 인증번호를 발송합니다.")
    @PostMapping("/signup/request")
    public ResponseEntity<ApiResponse> requestSignup(@RequestBody LoginDto loginDto) {
        try {
            mailService.sendVerificationEmail(loginDto.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to " + loginDto.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SendEmailError", "Failed to send verification code: " + e.getMessage()));
        }
    }

    @Operation(summary = "회원가입", description = "userEmail, password, userEmail로 발급된 인증번호를 입력받아, 회원가입을 진행합니다.")
    @PostMapping("/signup/verify")
    public ResponseEntity<ApiResponse> join(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        ApiResponse apiResponse = memberService.signup(loginDto.getEmail(), loginDto.getPassword(), loginDto.getVerificationCode(), response);
        return ResponseEntity.ok(apiResponse);
    }

    @Operation(summary = "회원탈퇴", description = "로그인된 사용자가 자신의 비밀번호를 입력하여 회원탈퇴를 진행합니다. Headers에서 Authorization를 Key로 하고 " +
            "Bearer " + "+accessToken" + " 값을 Value로 하여 유저를 검증하고, 유저의 비밀번호를 입력받아 탈퇴를 진행합니다." +
            "\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"password\": \"비밀번호\"\n" +
            "}\n" +
            "```")
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<ApiResponse> deleteAccount(@RequestBody String password, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            log.debug("Delete account request received.");

            // Retrieve token from Authorization header
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix
            log.debug("accessToken =>" + accessToken);

            ApiResponse response = memberService.deleteAccount(password, accessToken);

            log.debug("Delete account request processed successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing delete account request.", e);
            return ResponseEntity.status(500).body(ApiResponse.error("ServerError", "Failed to delete account: " + e.getMessage()));
        }
    }

    @Operation(summary = "Refresh Token 존재 여부 확인", description = "Refresh Token이 존재하는지 여부를 확인합니다.")
    @GetMapping("/refreshToken/exists")
    public ResponseEntity<ApiResponse> refreshTokenExists(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        Map<String, Object> result = new HashMap<>();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
                        result.put("message", "Refresh token is valid");
                        return ResponseEntity.ok(ApiResponse.success(result));
                    } else {
                        result.put("message", "Refresh token is invalid or expired");
                        return ResponseEntity.ok(ApiResponse.success(result));
                    }
                }
            }
        }

        result.put("message", "Refresh token not found");
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "로그아웃", description = "Refresh Token을 삭제합니다.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 refreshToken을 가져옴
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    // Refresh Token 쿠키를 삭제하기 위해 유효 기간을 0으로 설정
                    cookie.setValue(null);
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    cookie.setHttpOnly(true);
                    cookie.setSecure(true);  // Secure 옵션 추가
                    response.addCookie(cookie);

                    return ResponseEntity.ok(ApiResponse.success("Successfully logged out"));
                }
            }
        }

        // Refresh Token 쿠키가 없을 경우
        return ResponseEntity.ok(ApiResponse.success("No refresh token to logout"));
    }


    @Operation(summary = "refreshToken발급", description = "Refresh Token을 발급받습니다.")
    @GetMapping("/request-refresh-token")
    public ResponseEntity<?> requestRefreshToken(Authentication authentication, HttpServletResponse response) {
        try {
            JwtToken jwtToken;
            if (authentication instanceof OAuth2AuthenticationToken) {
                OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
                jwtToken = jwtTokenProvider.generateToken(authToken);
                log.info("Generated new JWT token for user: {}", authToken.getName());
            } else if (authentication instanceof UsernamePasswordAuthenticationToken) {
                UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication;
                jwtToken = jwtTokenProvider.generateToken(authToken);
                log.info("Generated new JWT token for user: {}", authToken.getName());
            } else {
                log.error("Unsupported authentication type: {}", authentication.getClass().getName());
                return ResponseEntity.ok(ApiResponse.error("AUTH_ERROR", "Unsupported authentication type"));
            }

            // 새로운 Refresh Token을 쿠키에 저장
            Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 설정
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setDomain("travel-point-umber.vercel.app");
            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일간 유효

            response.addCookie(refreshTokenCookie);
            log.info("Refresh token cookie created and added to response for user: {}", authentication.getName());

            return ResponseEntity.ok(ApiResponse.success("Refresh token generated successfully", null));
        } catch (Exception e) {
            log.error("Failed to generate JWT token for refresh: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.error("TOKEN_GENERATION_FAILED", "Failed to generate JWT token for refresh"));
        }
    }
}