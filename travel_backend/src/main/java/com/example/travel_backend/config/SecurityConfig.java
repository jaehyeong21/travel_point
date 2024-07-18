package com.example.travel_backend.config;


import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.handler.PrincipalFailureHandler;
import com.example.travel_backend.handler.PrincipalSuccessHandler;
import com.example.travel_backend.jwt.JwtAuthenticationFilter;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

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

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        return httpSecurity
//        httpSecurity
//                // REST API이므로 basic auth 및 csrf 보안을 사용하지 않음
//                .httpBasic().disable()
//                .csrf().disable()
//                // JWT를 사용하기 때문에 세션을 사용하지 않음
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authorizeHttpRequests()
//                // 해당 API에 대해서는 모든 요청을 허가
//                .requestMatchers("/loginForm").permitAll()
//                .requestMatchers("/signup/verify").permitAll()
//                .requestMatchers("/signup/request").permitAll()
////                .requestMatchers("/api/**").authenticated() // /api/** 경로에 대해서만 인증을 요구 특정 경로대해서 요구
//                .anyRequest().permitAll() // 나머지 경로는 인증 없이 접근 가능
//                .and()
//                .formLogin()
//                .loginPage("/loginForm")
//                .loginProcessingUrl("/login")
//                .defaultSuccessUrl("/")
//                .and()
//                .oauth2Login()
//                .successHandler(principalSuccessHandler)
//                .failureHandler(principalFailureHandler)
//                .and()
//                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
//        return httpSecurity.build();

        httpSecurity
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .cors().configurationSource(corsConfigurationSource) // CORS 설정 추가
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/loginForm", "/signup/verify", "/signup/request", "/login/oauth2/**").permitAll() // OAuth2 콜백 경로 추가
                .anyRequest().permitAll()
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
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    // 쿠키 삭제
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    // 응답 객체 생성
                    ApiResponse apiResponse = ApiResponse.success("Successfully logged out", null);

                    // JSON 응답 반환
                    response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
                    response.getWriter().flush();
                })
                .deleteCookies("refreshToken")
                .invalidateHttpSession(true)
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
