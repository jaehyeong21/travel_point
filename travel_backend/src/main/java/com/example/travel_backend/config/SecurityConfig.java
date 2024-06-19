package com.example.travel_backend.config;


import com.example.travel_backend.handler.PrincipalFailureHandler;
import com.example.travel_backend.handler.PrincipalSuccessHandler;
import com.example.travel_backend.jwt.JwtAuthenticationFilter;
import com.example.travel_backend.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig  {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PrincipalSuccessHandler principalSuccessHandler;

    @Autowired
    private PrincipalFailureHandler principalFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        return httpSecurity
        httpSecurity
                // REST API이므로 basic auth 및 csrf 보안을 사용하지 않음
                .httpBasic().disable()
                .csrf().disable()
                // JWT를 사용하기 때문에 세션을 사용하지 않음
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests()
                // 해당 API에 대해서는 모든 요청을 허가
                .requestMatchers("/loginForm").permitAll()
                .requestMatchers("/signup/verify").permitAll()
                .requestMatchers("/signup/request").permitAll()
//                .requestMatchers("/api/**").authenticated() // /api/** 경로에 대해서만 인증을 요구 특정 경로대해서 요구
                .anyRequest().permitAll() // 나머지 경로는 인증 없이 접근 가능
                .and()
                .formLogin()
                .loginPage("/loginForm")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/")
                .and()
                .oauth2Login()
                .successHandler(principalSuccessHandler)
                .failureHandler(principalFailureHandler)
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
