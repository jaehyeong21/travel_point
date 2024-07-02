package com.example.travel_backend.controller.login;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.LoginDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.service.MailService;
import com.example.travel_backend.service.MemberService;
import com.example.travel_backend.validator.EmailValidator;
import com.example.travel_backend.validator.PasswordValidator;
import io.jsonwebtoken.Jwt;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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


    @Operation(summary = "로그인", description = "사용자의 이메일 주소와 비밀번호로 로그인을 진행합니다.")
    @PostMapping("/loginForm")
    public ResponseEntity<ApiResponse> loginForm(@RequestBody LoginDto loginDto) {
        ApiResponse response = memberService.login(loginDto.getEmail(), loginDto.getPassword());
        return ResponseEntity.ok(response);
    }


    @Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 Access Token을 갱신합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshAccessToken(@RequestBody Map<String, String> tokenMap) {
        String refreshToken = tokenMap.get("refreshToken");
        try {
            JwtToken newJwtToken = jwtTokenProvider.refreshToken(refreshToken);
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", newJwtToken.getAccessToken());
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("InvalidToken", "Refresh token is invalid or expired"));
        }
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
    public ResponseEntity<ApiResponse> join(@RequestBody LoginDto loginDto) {
        ApiResponse response = memberService.signup(loginDto.getEmail(), loginDto.getPassword(), loginDto.getVerificationCode());
        return ResponseEntity.ok(response);
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
            log.debug("accessToken =>"+ accessToken);

            ApiResponse response = memberService.deleteAccount(password, accessToken);

            log.debug("Delete account request processed successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing delete account request.", e);
            return ResponseEntity.status(500).body(ApiResponse.error("ServerError", "Failed to delete account: " + e.getMessage()));
        }
    }


}
