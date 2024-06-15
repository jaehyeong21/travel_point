package com.example.travel_backend.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PasswordResetDto  {
    private String email;
    private String verificationCode;
    private String newPassword;
}