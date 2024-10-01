package com.example.travel_backend.controller.login;

import com.example.travel_backend.data.LoginDto;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
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

    //로그인
    @Operation(summary = "로그인", description = "userEmail과 password를 입력받아, 로그인을 진행합니다.")
    @PostMapping("/loginForm")
    public ResponseEntity<?> loginForm(@RequestBody LoginDto loginDto) {
        String userEmail = loginDto.getEmail();
        String password = loginDto.getPassword();

        Optional<Member> memberOptional = memberRepository.findByEmail(userEmail);

        if (!memberOptional.isPresent()) {
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid Email", "AUTH001"));
        }

        Member member = memberOptional.get();

        // 이메일이 존재하므로 비밀번호를 검증
        if (!bCryptPasswordEncoder.matches(password, member.getPassword())) {
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid Password", "AUTH002"));
        }

        // JWT 토큰 생성
        JwtToken jwtToken = memberService.login(userEmail, password);

        // 응답 데이터 생성
        Map<String, Object> response = new HashMap<>();
        response.put("response", "ok");
        response.put("result", createLoginResponse(member, jwtToken));
//        response.put("token", jwtToken);

        return ResponseEntity.ok(response);
    }

    // 회원가입
    @Operation(summary = "회원가입", description = "userEmail과 password를 입력받아, 회원가입을 진행합니다.")
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Member member) {
        // 이메일 형식을 검증
        if (!EmailValidator.isValidEmail(member.getEmail())) {
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid Email", "EmailError"));
        }
        // 패스워드 형식을 검증
        if (!PasswordValidator.isValid(member.getPassword())) {
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid Password", "PasswordError"));
        }

        // 패스워드 인코딩
        String rawPassword = member.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        member.setPassword(encPassword);

        // 회원 저장
        member.setRole("USER");
        memberRepository.save(member);

        // JWT 토큰 생성
        JwtToken jwtToken = memberService.login(member.getEmail(), rawPassword);

        // 회원 정보 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("response", "ok");
        response.put("result", createJoinResponse(member, jwtToken));


        return ResponseEntity.ok(response);
    }

    // 회원가입 응답 생성
    private Map<String, Object> createJoinResponse(Member member, JwtToken jwtToken) {

        String userImgUrl = "/assets/image/characters/anonymous.png";

        if (member.getUserImgUrl() == null || member.getUserImgUrl().isEmpty()) {
            member.setUserImgUrl(userImgUrl);
        }

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", member.getId());
        userMap.put("createDate", member.getCreateDate());
        userMap.put("username", member.getUsername());
        userMap.put("userImgUrl", userImgUrl);
        userMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        return result;
    }

    // 로그인 응답 생성
    private Map<String, Object> createLoginResponse(Member member, JwtToken jwtToken) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", member.getId());
        userMap.put("createDate", member.getCreateDate());
        userMap.put("username", member.getUsername());
        userMap.put("userImgUrl", member.getUserImgUrl());
        userMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", userMap);
        result.put("token", jwtToken);

        return result;
    }

    // 에러 응답 생성
    private Map<String, Object> createErrorResponse(String message, String errorCode) {
        Map<String, Object> response = new HashMap<>();
        response.put("response", false);
        response.put("message", message);
        response.put("errorCode", errorCode);
        return response;
    }
}