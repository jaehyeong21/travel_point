package com.example.travel_backend.data;

import com.example.travel_backend.model.Member;
import lombok.*;

import java.sql.Timestamp;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDto {

    private Long id;
    private String username;
    private String password;
    private String userImgUrl;
    private String email;
    private String role;
    private String provider;
    private String providerId;
    private String createDate;

    static public MemberDto toDto(Member member) {
        return MemberDto.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                .userImgUrl(member.getUserImgUrl())
                .email(member.getEmail())
                .role(member.getRole())
                .provider(member.getProvider())
                .providerId(member.getProviderId())
                .createDate(String.valueOf(member.getCreateDate()))
                .build();
    }

    public Member toEntity() {
        return Member.builder()
                .username(username)
                .password(password)
                .userImgUrl(userImgUrl)
                .email(email)
                .role(role)
                .provider(provider)
                .providerId(providerId)
                .createDate(Timestamp.valueOf(createDate))
                .build();
    }
}