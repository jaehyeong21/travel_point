package com.example.travel_backend.controller.login;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.LoginDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import com.example.travel_backend.service.MailService;
import com.example.travel_backend.service.MemberService;
import com.example.travel_backend.validator.EmailValidator;
import com.example.travel_backend.validator.PasswordValidator;
import io.jsonwebtoken.Jwt;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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

    // 로그인
    @Operation(summary = "로그인", description = "userEmail과 password를 입력받아, 로그인을 진행합니다.")
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

        // 로그인 성공 응답 생성
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", member.getId());
        userMap.put("createDate", member.getCreateDate());
        userMap.put("username", member.getUsername());
        userMap.put("userImgUrl", member.getUserImgUrl());
        userMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 회원가입
    @Operation(summary = "회원가입", description = "userEmail과 password를 입력받아, 회원가입을 진행합니다.")
    @PostMapping("/join")
    public ResponseEntity<ApiResponse> join(@RequestBody LoginDto loginDto) {
        String userEmail = loginDto.getEmail();
        String password = loginDto.getPassword();
        String verificationCode = loginDto.getVerificationCode();

        // 이메일 형식을 검증
        if (!EmailValidator.isValidEmail(userEmail)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("EmailError", "Invalid Email Format"));
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
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", member.getId());
        userMap.put("createDate", member.getCreateDate());
        userMap.put("username", member.getUsername());
        userMap.put("userImgUrl", "/assets/image/characters/anonymous.png");
        userMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}