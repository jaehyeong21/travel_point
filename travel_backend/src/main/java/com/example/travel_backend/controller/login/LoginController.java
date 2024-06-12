package com.example.travel_backend.controller.Login;

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

@RestController("loginController")
public class LoginController {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MemberService memberService;

//    //로그인
//    @Operation(summary = "로그인", description = "userEmail과 password를 입력받아, 로그인을 진행합니다.")
//    @PostMapping("/loginForm")
//    public ResponseEntity<?> loginForm(@RequestBody Map<String, String> loginData) {
//        String userEmail = loginData.get("email");
//        String password = loginData.get("password");

//        Member member = memberRepository.findByEmail(userEmail);
//
//        if (member == null) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("response", false);
//            response.put("message", "Invalid Email");
//            response.put("errorCode", "AUTH001");
//            return ResponseEntity.badRequest().body(response);
//        }
//
//        // 이메일이 존재하므로 비밀번호를 검증
//        if (!bCryptPasswordEncoder.matches(password, member.getPassword())) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("response", false);
//            response.put("message", "Invalid Password");
//            response.put("errorCode", "AUTH001");
//            return ResponseEntity.badRequest().body(response);
//        }
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("id", member.getId());
//        result.put("createDate", member.getCreateDate());
//        result.put("userName", member.getUsername());
//        result.put("userImgUrl", member.getUserImgUrl());
//        result.put("userEmail", userEmail);
//
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("response", "ok");
//        response.put("result", result);
//        response.put("token", "test");
//
//        return ResponseEntity.ok(response);
//    }
    @Operation(summary = "로그인", description = "userEmail과 password를 입력받아, 로그인을 진행합니다.")
    @PostMapping("/loginForm")
    public JwtToken login(@RequestBody LoginDto loginDto){
        String userEmail = loginDto.getEmail();
        String password = loginDto.getPassword();
        JwtToken jwtToken = memberService.login(userEmail,password);

        return jwtToken;
    }

    //스프링시큐리티 해당주소를 낚아채버린다. -> SecurityConfig 파일 생성 후 작동안함.
    //회원가입
    @Operation(summary = "회원가입", description = "userEmail과 password를 입력받아, 회원가입을 진행합니다.")
    @PostMapping("/join") //joinForm에서 Post방식으로 보냄
    public ResponseEntity<?> join(@RequestBody Member member) {
        // 이메일 형식을 검증
        if (!EmailValidator.isValidEmail(member.getEmail())) {
            Map<String, Object> response = new HashMap<>();
            response.put("response", false);
            response.put("message", "Invalid Email");
            response.put("errorCode", "EmailError");

            Map<String, Object> result = new HashMap<>();
            result.put("member", member);
            response.put("result", result);
            return ResponseEntity.badRequest().body(response);
        }
        // 패스워드 형식을 검증
        if (!PasswordValidator.isValid(member.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("response", false);
            response.put("message", "Invalid Password");
            response.put("errorCode", "PasswordError");

            Map<String, Object> result = new HashMap<>();
            result.put("member", member);
            response.put("result", result);
            return ResponseEntity.badRequest().body(response);
        }

        member.setRole("ROLE_USER");
        String rawPassword = member.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        member.setPassword(encPassword);

        memberRepository.save(member);

        String userImgUrl = "http://localhost:8080/assets/image/characters/anonymous.png";

        if (member.getUserImgUrl() == null || member.getUserImgUrl().isEmpty()) {
            member.setUserImgUrl(userImgUrl);
        }

        Map<String, Object> memberMap = new HashMap<>();
        memberMap.put("id", member.getId());
        memberMap.put("createDate", member.getCreateDate());
        memberMap.put("username", member.getUsername());
        memberMap.put("userImgUrl", member.getUserImgUrl());
        memberMap.put("email", member.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("user", memberMap);
        result.put("token", "jwt-token-string");  // 여기에 실제 JWT 토큰 생성 및 설정

        Map<String, Object> response = new HashMap<>();
        response.put("response", true);
        response.put("result", result);

        return ResponseEntity.ok(response);
    }

}
