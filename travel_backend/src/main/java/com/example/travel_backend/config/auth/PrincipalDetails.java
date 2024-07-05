package com.example.travel_backend.config.auth;

import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.model.Member;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Slf4j
@Data
public class PrincipalDetails implements UserDetails, OAuth2User {
    private Member member; // 콤포지션
    private Map<String, Object> attributes;
    private JwtToken jwtToken;

    // 일반 로그인
    public PrincipalDetails(Member member) {
        this.member = member;
    }

    // OAuth 로그인
    public PrincipalDetails(Member member, Map<String, Object> attributes) {
        this.member = member;
        this.attributes = attributes;
    }

    // OAuth 로그인 + JWT 토큰
    public PrincipalDetails(Member member, Map<String, Object> attributes, JwtToken jwtToken) {
        this.member = member;
        this.attributes = attributes;
        this.jwtToken = jwtToken;
    }

    // 해당 User의 권한을 리턴
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(() -> member.getRole());
        return collect;
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        if (this.member != null && this.member.getEmail() != null && !this.member.getEmail().isEmpty()) {
            return this.member.getEmail();
        } else {
            log.error("Email is null or empty for member: {}", this.member);
            throw new IllegalStateException("Member email cannot be null or empty");
        }
    }
}