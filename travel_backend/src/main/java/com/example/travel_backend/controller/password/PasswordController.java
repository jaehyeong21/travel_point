package com.example.travel_backend.controller.password;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.EmailVerificationDto;
import com.example.travel_backend.data.PasswordResetDto;
import com.example.travel_backend.service.MailService;
import com.example.travel_backend.service.MemberService;
import com.example.travel_backend.validator.PasswordValidator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/password")
@Tag(name = "비밀번호 관리", description = "비밀번호 재설정 및 관리 API")
@RequiredArgsConstructor
public class PasswordController {

    private final MailService mailService;
    private final MemberService memberService;
    private static final Logger log = LoggerFactory.getLogger(PasswordController.class);

    @Operation(summary = "비밀번호를 찾기 위한 이메일로 인증번호 발송", description = "비밀번호 재설정을 위해 사용자의 이메일로 인증번호를 발송합니다.")
    @PostMapping("/reset-request")
    public ResponseEntity<ApiResponse> sendVerificationCode(@RequestBody EmailVerificationDto emailVerificationDto) {
        try {
            String email = emailVerificationDto.getEmail();
            mailService.sendPasswordResetEmail(email); // 입력받은 email로 비밀번호 재설정을 위한 인증번호 발송
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to " + email));
        } catch (MessagingException e) {
            log.error("Failed to send verification code: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SendEmailError", "Failed to send verification code: " + e.getMessage()));
        }
    }

    @Operation(summary = "비밀번호 재설정", description = "인증번호를 사용하여 새로운 비밀번호로 재설정합니다.")
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody PasswordResetDto passwordResetDto) {
        String email = passwordResetDto.getEmail();
        String verificationCode = passwordResetDto.getVerificationCode();
        String newPassword = passwordResetDto.getNewPassword();

        try {
            if (!PasswordValidator.isValid(newPassword)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("PasswordError", "Invalid password format."));
            }

            log.info("Attempting to reset password for email: {}", email);
            log.info("Verification code: {}", verificationCode);
            log.info("New password: {}", newPassword);

            ApiResponse apiResponse = memberService.resetPassword(email, verificationCode, newPassword);

            if (apiResponse.isResponse()) {
                log.info("Password reset successfully for email: {}", email);
                return ResponseEntity.ok(ApiResponse.success("Password reset successfully for " + email));
            } else {
                log.error("Failed to reset password for email: {}. Error: {}", email, apiResponse.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
            }
        } catch (IllegalArgumentException e) {
            log.error("Error resetting password for email {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error("ResetPasswordError", e.getMessage()));
        }
    }
}