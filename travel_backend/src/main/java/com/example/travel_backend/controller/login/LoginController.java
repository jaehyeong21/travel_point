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


    // 로그인
    @Operation(summary = "로그인",
            description = "사용자의 이메일 주소와 비밀번호로 로그인을 진행합니다.\n\n" +
                    "Example request body:\n" +
                    "```json\n" +
                    "{\n" +
                    "  \"email\": \"example@example.com\",\n" +
                    "  \"password\": \"비밀번호\"\n" +
                    "}\n" +
                    "```")
    @PostMapping("/loginForm")
    public ResponseEntity<ApiResponse> loginForm(@RequestBody LoginDto loginDto) {
        String userEmail = loginDto.getEmail();
        String password = loginDto.getPassword();

        Optional<Member> memberOptional = memberRepository.findByEmail(userEmail);

        if (!memberOptional.isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("AUTH001", "Invalid Email"));
        }

        Member member = memberOptional.get();

        // 이메일이 존재하므로 비밀번호를 검증
        if (!bCryptPasswordEncoder.matches(password, member.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("AUTH002", "Invalid Password"));
        }

        // JWT 토큰 생성
        JwtToken jwtToken = memberService.login(userEmail, password);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", jwtToken.getAccessToken());
        result.put("refreshToken", jwtToken.getRefreshToken());

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "토큰 갱신",
            description = "Refresh Token을 사용하여 Access Token을 갱신합니다.\n\n" +
                    "Example request body:\n" +
                    "```json\n" +
                    "{\n" +
                    "  \"refreshToken\": \"eyJhbGciOiJIUzI1NiJ9...\"\n" +
                    "}\n" +
                    "```\n" +
                    "Headers:\n" +
                    "```json\n" +
                    "{\n" +
                    "  \"Authorization\": \"Bearer eyJhbGciOiJIUzI1NiJ9...\"\n" +
                    "}\n" +
                    "```")
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

    //회원가입 요청(이메일)
    @Operation(summary = "회원가입 요청", description = "이메일과 비밀번호를 검증하고, 해당 이메일로 인증번호를 발송합니다.\n\n" +
            "Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"email\": \"example@example.com\",\n" +
            "  \"password\": \"비밀번호\"\n" +
            "}\n" +
            "```")
    @PostMapping("/signup/request")
    public ResponseEntity<ApiResponse> requestSignup(@RequestBody LoginDto loginDto) {
        String email = loginDto.getEmail();
        String password = loginDto.getPassword();

        // 이메일 형식 검증
        if (!EmailValidator.isValidEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("EmailError", "Invalid Email Format"));
        }

        // 이메일 중복 확인
        if (memberRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("EmailExists", "This email is already registered"));
        }

        // 비밀번호 형식 검증
        if (!PasswordValidator.isValid(password)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("PasswordError", "Invalid Password Format"));
        }
        // 이메일 전송 시도
        try {
            mailService.sendVerificationEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to " + email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SendEmailError", "Failed to send verification code: " + e.getMessage()));
        }
    }

    // 회원가입
    @Operation(summary = "회원가입", description = "userEmail, password, userEmail로 발급된 인증번호를 입력받아, 회원가입을 진행합니다."
            + "비밀번호의 경우 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자, 특수문자 포함 조건에 만족해야합니다."+"Example request body:\n" +
            "```json\n" +
            "{\n" +
            "  \"email\": \"example@example.com\",\n" +
            "  \"password\": \"비밀번호\"\n" +
            "  \"verificationCode\": \"인증번호\"\n" +
            "}\n" +
            "```"
    )
    @PostMapping("/signup/verify")
    public ResponseEntity<ApiResponse> join(@RequestBody LoginDto loginDto) {
        String userEmail = loginDto.getEmail();
        String password = loginDto.getPassword();
        String verificationCode = loginDto.getVerificationCode();

        // 이메일 형식을 검증
        if (!EmailValidator.isValidEmail(userEmail)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("EmailError", "Invalid Email Format"));
        }

        // 이미 가입된 이메일인지 확인
        if (memberRepository.findByEmail(userEmail).isPresent()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("EmailExists", "This email is already registered"));
        }

        // 패스워드 형식을 검증
        if (!PasswordValidator.isValid(password)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("PasswordError", "Invalid Password Format"));
        }

        // 이메일로 전송된 인증 코드 가져오기
        String storedVerificationCode = mailService.getStoredVerificationCode(userEmail);

        // 클라이언트가 입력한 인증 코드와 저장된 인증 코드가 일치하는지 확인
        if (!verificationCode.equals(storedVerificationCode)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("VerificationError", "Invalid Verification Code"));
        }

        // 패스워드 인코딩
        String encPassword = bCryptPasswordEncoder.encode(password);

        // 회원 저장
        Member member = new Member();
        member.setEmail(userEmail);
        member.setPassword(encPassword);
        member.setRole("USER");
        memberRepository.save(member);

        // JWT 토큰 생성
        JwtToken jwtToken = memberService.login(userEmail, password);

        // 회원가입 성공 응답 생성
        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", jwtToken.getAccessToken());
        result.put("refreshToken", jwtToken.getRefreshToken());


        return ResponseEntity.ok(ApiResponse.success(result));
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
