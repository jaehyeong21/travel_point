package com.example.travel_backend.jwt;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
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

    public JwtToken generateToken(Authentication authentication) {
        // UserDetails를 PrincipalDetails로 캐스팅합니다.
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member member = principalDetails.getMember();
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + 7200000); // 2 hours

        String accessToken = Jwts.builder()
                .setSubject(member.getEmail())  // 이메일을 subject에 저장
                .claim("auth", authorities)
                .claim("id", member.getId())
                .claim("createDate", member.getCreateDate())
                .claim("username", member.getUsername())
                .claim("userImgUrl", member.getUserImgUrl())
                .claim("email", member.getEmail())
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        String refreshToken = Jwts.builder()
                .setSubject(member.getEmail())
                .setExpiration(new Date(now + 604800000)) // 7 days
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

            Optional<Member> memberOptional = memberRepository.findByEmail(username);
            if (!memberOptional.isPresent()) {
                throw new RuntimeException("Invalid Refresh Token");
            }

            Member member = memberOptional.get();
            Collection<? extends GrantedAuthority> authorities = member.getAuthorities();

            Collection<GrantedAuthority> grantedAuthorities = authorities.stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                    .collect(Collectors.toList());

            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, grantedAuthorities);

            return generateToken(authentication);
        }
        throw new RuntimeException("Invalid Refresh Token");
    }

    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);

        log.debug("Claims: {}", claims);

        if (claims.get("auth") == null) {
            log.error("권한 정보가 없는 토큰입니다. Claims: {}", claims);
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);
        log.debug("Extracted principal from token: {}", principal);

        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

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

    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String email = claims.getSubject();
            log.debug("Extracted email from token: {}", email);
            return email;
        } catch (Exception e) {
            log.error("Failed to extract email from token", e);
            return null;
        }
    }

    public int getMemberIdFromToken(String token) {
        String email = getUsernameFromToken(token);
        Optional<Member> memberOptional = memberRepository.findByEmail(email);
        if (memberOptional.isPresent()) {
            return memberOptional.get().getId();
        }
        throw new RuntimeException("Member not found for email: " + email);
    }

    public String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("auth", String.class);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT Token", e);
            throw new RuntimeException("Invalid JWT Token");
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT Token", e);
            throw new RuntimeException("Expired JWT Token");
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT Token", e);
            throw new RuntimeException("Unsupported JWT Token");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty.", e);
            throw new RuntimeException("JWT claims string is empty.");
        }
    }
}