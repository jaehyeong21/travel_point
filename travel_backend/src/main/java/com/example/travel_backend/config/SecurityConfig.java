package com.example.travel_backend.config;


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


//    private PrincipleOauth2MemberService principleOauth2MemberService;

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
                .requestMatchers("/join").permitAll()
//                .requestMatchers("/sign-up/emailCheck").permitAll() // 추가된 부분
                // USER 권한이 있어야 요청할 수 있음
//                .requestMatchers("/loginForm/men").hasRole("USER")
                .anyRequest().permitAll();

        httpSecurity
                .formLogin().loginPage("/loginForm")
                .loginProcessingUrl("/login") //login 주소가 호출이 되면 시큐리티가 낚아채서 대신 로그인을 진행 -> Controller에 /login 안만들어도됨
                .defaultSuccessUrl("/") //로그인이 완료되면 /기본 메인 페이지로 이동, 혹은 어떤 특정 페이지에서 loginForm을 요청하여 로그인하면 해당 페이지로 보내준다.


                // 이 밖에 모든 요청에 대해서 인증을 필요로 한다는 설정
//                .anyRequest().authenticated()

                .and()
                // JWT 인증을 위하여 직접 구현한 필터를 UsernamePasswordAuthenticationFilter 전에 실행
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
