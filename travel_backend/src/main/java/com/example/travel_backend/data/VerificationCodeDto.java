package com.example.travel_backend.data;

import lombok.Data;

@Data
public class VerificationCodeDto {
    private String identifier; // 사용자 아이디 (이메일 또는 휴대폰 번호)
    private String code; // 사용자가 입력한 인증 코드
}