package com.example.travel_backend.config;

import com.example.travel_backend.config.oauth.PrincipleOauth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig  {

    @Autowired
    private PrincipleOauth2UserService principleOauth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 인가(접근권한) 설정
        http.authorizeHttpRequests().requestMatchers("/user/**").authenticated()
                .requestMatchers("/manager/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                .requestMatchers("/admin/**").hasAnyAuthority("ROLE_ADMIN")
                .anyRequest().permitAll();

        http.formLogin().loginPage("/loginForm")
                .loginProcessingUrl("/login") //login 주소가 호출이 되면 시큐리티가 낚아채서 대신 로그인을 진행 -> Controller에 /login 안만들어도됨
                .defaultSuccessUrl("/")
                .and()
                .oauth2Login()
                .loginPage("/loginForm") //구글 로그인이 완료 된 뒤의 후처리가 필요함, 구글 로그인이 되면 엑세스 토큰 + 사용자 프로필 정보를 함께 받음음
                .userInfoEndpoint()
                .userService(principleOauth2UserService); //Service내부에 들어가는 것은 Oauth2UserService가 되어야한다.


        // 사이트 위변조 요청 방지
        http.csrf().disable();

        return http.build();
    }
}
