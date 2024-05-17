package com.example.travel_backend.controller.Login;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.model.User;
import com.example.travel_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/test/login")
    public @ResponseBody String testLogin(
            Authentication authentication,

            @AuthenticationPrincipal PrincipalDetails userDetails){

        System.out.println("/test/login ==================");
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        System.out.println("principalDetails : "+ principalDetails.getUser());
        //principalDetails : User(id=7, username=test, password=$2a$10$m/eYj1q3i0F/CHqltezgyuAoMv9cIhUP/LSU3OrHueUSJnH9hAFfy, email=test@test.com, role=ROLE_USER, createDate=2024-05-11 01:10:49.0)


        System.out.println("authentication : " + authentication.getPrincipal());
        //authentication.getPrincipal() => com.example.oauth2_test.config.auth.PrincipalDetails@79a1f15c
        //return 타입이 Object이다.

        System.out.println("userDetails : "+ userDetails.getUsername());
        System.out.println("userDetails : "+ userDetails.getUser());
        return "세션 정보 확인하기";
    }


    @GetMapping("/test/oauth/login")
    public @ResponseBody String testOAuthLogin(
            Authentication authentication,
            @AuthenticationPrincipal OAuth2User oauth){

        System.out.println("/test/oauth/login ==================");
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        System.out.println("principalDetails : "+ oAuth2User.getAttributes());

        System.out.println("oauth2User : "+ oauth.getAttributes());
        return "OAuth 세션 정보 확인하기";
    }

    //mustache 실험 -> src/main/resources/templates/index.mustache
    @GetMapping({"","/"})
    public String index(){
        return "index";
    }

    //OAuth 로그인을 해도 PrincipalDetails로 받을 수 있음
    @GetMapping("/user")
    public @ResponseBody String user(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        System.out.println("principalDetails : "+ principalDetails.getUser());
        return "user";
    }

    @GetMapping("/admin")
    public @ResponseBody String admin() {
        return "admin";
    }

    @GetMapping("/manager")
    public @ResponseBody String manager() {
        return "manager";
    }

    //로그인화면
    @GetMapping("/loginForm")
    public Map<String, Object> loginForm() {
        Map<String, Object> response = new HashMap<>();
        response.put("response", "ok");
        response.put("result", new HashMap<>());

        return response; // JSON 형식으로 응답
    }

    //회원가입 화면
    @GetMapping("/joinForm")
    public Map<String, Object> joinForm() {
        Map<String, Object> response = new HashMap<>();
        response.put("response", "ok");
        response.put("result", new HashMap<>());

        return response; // JSON 형식으로 응답
    }

    //스프링시큐리티 해당주소를 낚아채버린다. -> SecurityConfig 파일 생성 후 작동안함.
    @PostMapping("/join") //joinForm에서 Post방식으로 보냄
    public Map<String, Object> join(@RequestBody User user) {
        System.out.println("Received user: " + user); // 로깅 추가
        if (user.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }

        user.setRole("ROLE_USER");
        String rawPassword = user.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        user.setPassword(encPassword);

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("response", "ok");
        response.put("result", new HashMap<>());

        return response; // JSON 형식으로 응답
    }

    @Secured("ROLE_ADMIN") //@EnableMethodSecurity에 의해 동작, 권한이  ADMIN일때 접속 가능
    @GetMapping("/info")
    public @ResponseBody String info(){
        return "개인정보";
    }

    //두개의 제한을 걸고 싶다면 PreAuthorize를 활용, prePostEnabled = true에 의해동작
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/data")
    public @ResponseBody String data(){
        return "데이터정보";
    }


}
