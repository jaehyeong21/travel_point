package com.example.travel_backend.jwt;

import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
    private final MemberRepository memberRepository;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, MemberRepository memberRepository) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.memberRepository = memberRepository;
    }

    // Member 정보를 가지고 AccessToken, RefreshToken을 생성하는 메서드
    public JwtToken generateToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();

        // Access Token: 1시간
        Date accessTokenExpiresIn = new Date(now + 3600000); // 3600000밀리초 = 1시간
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName()) // 토큰의 주체를 설정 (사용자 이름)
                .claim("auth", authorities) // 권한 정보를 클레임에 추가
                .setExpiration(accessTokenExpiresIn) // 토큰 만료시간 설정
                .signWith(key, SignatureAlgorithm.HS256) // 서명 알고리즘과 키를 사용하여 토큰에 서명
                .compact(); // 토큰을 생성하고 문자열로 반환

        // Refresh Token: 1주일
        String refreshToken = Jwts.builder()
                .setSubject(authentication.getName()) // Refresh Token에 주체를 설정 (사용자 이름)
                .setExpiration(new Date(now + 604800000)) // 604800000밀리초 = 7일
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return JwtToken.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public JwtToken refreshToken(String refreshToken) {
        if (validateToken(refreshToken)) {
            Claims claims = parseClaims(refreshToken);
            String username = claims.getSubject();

            // 사용자 인증을 위한 사용자 정보 생성
            Optional<Member> memberOptional = memberRepository.findByEmail(username);
            if (!memberOptional.isPresent()) {
                throw new RuntimeException("Invalid Refresh Token");
            }

            Member member = memberOptional.get();
            Collection<? extends GrantedAuthority> authorities = member.getAuthorities();

            // 권한 정보를 Collection<GrantedAuthority>로 변환
            Collection<GrantedAuthority> grantedAuthorities = authorities.stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                    .collect(Collectors.toList());

            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, grantedAuthorities);

            return generateToken(authentication);
        }
        throw new RuntimeException("Invalid Refresh Token");
    }

    // Jwt 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);

        // 로그 추가: Claims 정보 출력
        log.debug("Claims: {}", claims);

        if (claims.get("auth") == null) {
            // 로그 추가: auth 정보가 없을 때
            log.error("권한 정보가 없는 토큰입니다. Claims: {}", claims);
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // token 값으로 해당 user의 정보 조회
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public int getMemberIdFromToken(String token) {
        String email = getUsernameFromToken(token);
        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        if (memberOptional.isPresent()) {
            return memberOptional.get().getId();
        }
        throw new RuntimeException("Member not found for email: " + email);
    }

    // token 값으로 해당 user의 역할 정보 조회
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return claims.get("auth", String.class);
    }
}