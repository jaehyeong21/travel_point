package com.example.travel_backend.data;

import lombok.Data;

@Data
public class EmailVerificationDto {
    private String email;
    private String verificationCode;
}