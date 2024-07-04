package com.example.travel_backend.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonProperty("username")
    private String username;

    @JsonProperty("password")
    private String password;

    @JsonProperty("userImgUrl")
    @Builder.Default
    private String userImgUrl = "/assets/image/characters/anonymous.png";

    @JsonProperty("email")
    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty("role")
    private String role;

    @JsonProperty("provider")
    private String provider;

    @JsonProperty("providerId")
    private String providerId;

    @CreationTimestamp
    private Timestamp createDate;

    @CreationTimestamp
    private Timestamp emailVerified;

    // 권한 정보를 가져오는 메서드 추가
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(this.role));
    }
}