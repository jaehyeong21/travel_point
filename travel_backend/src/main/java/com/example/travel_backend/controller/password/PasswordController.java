package com.example.travel_backend.controller.password;

import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.EmailVerificationDto;
import com.example.travel_backend.data.PasswordChangeDto;
import com.example.travel_backend.data.PasswordResetDto;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
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
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/password")
@Tag(name = "비밀번호 관리", description = "비밀번호 재설정 및 관리 API")
@RequiredArgsConstructor
public class PasswordController {

    private final MailService mailService;
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private static final Logger log = LoggerFactory.getLogger(PasswordController.class);

    @Operation(summary = "비밀번호를 찾기 위한 이메일로 인증번호 발송",
            description = "비밀번호 재설정을 위해 사용자의 이메일로 인증번호를 발송합니다. " +
                    "이메일을 전송할 때는 요청 본문에 사용자의 이메일 주소만 포함하면 됩니다. " +
                    "인증번호는 이메일로 전송되며, 이후 비밀번호 재설정 API에서 필요합니다.\n\n" +
                    "Example request body:\n" +
                    "```\n" +
                    "{\n" +
                    "  \"email\": \"example@example.com\"\n" +
                    "}\n" +
                    "```")
    @PostMapping("/reset-request/email")
    public ResponseEntity<ApiResponse> sendVerificationCode(@RequestBody EmailVerificationDto emailVerificationDto) {
        try {
            String email = emailVerificationDto.getEmail();

            Optional<Member> memberOptional = memberRepository.findByEmail(email);

            //이메일 존재하는지 검증
            if (!memberOptional.isPresent()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("AUTH001", "Email doesn't exist"));
            }

            mailService.sendPasswordResetEmail(email); // 입력받은 email로 비밀번호 재설정을 위한 인증번호 발송
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to " + email));
        } catch (MessagingException e) {
            log.error("Failed to send verification code: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SendEmailError", "Failed to send verification code: " + e.getMessage()));
        }
    }

    /*

    @Operation(summary = "비밀번호를 찾기 위한 휴대폰으로 인증번호 발송",
            description = "비밀번호 재설정을 위해 사용자의 휴대폰으로 인증번호를 발송합니다. " +
                    "휴대폰 번호를 전송할 때는 요청 본문에 사용자의 휴대폰 번호만 포함하면 됩니다. " +
                    "인증번호는 SMS로 전송되며, 이후 비밀번호 재설정 API에서 필요합니다.\n\n" +
                    "Example request body:\n" +
                    "```\n" +
                    "{\n" +
                    "  \"phoneNumber\": \"+1234567890\"\n" +
                    "}\n" +
                    "```")
    @PostMapping("/reset-request/phone")
    public ResponseEntity<ApiResponse> sendPhoneVerificationCode(@RequestBody PhoneVerificationDto phoneVerificationDto) {
        try {
            String phoneNumber = phoneVerificationDto.getPhoneNumber();

            Optional<Member> memberOptional = memberRepository.findByPhoneNumber(phoneNumber);

            // 휴대폰 번호 존재하는지 검증
            if (!memberOptional.isPresent()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("AUTH001", "Phone number doesn't exist"));
            }

            smsService.sendPasswordResetSms(phoneNumber); // 입력받은 phoneNumber로 비밀번호 재설정을 위한 인증번호 발송
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully to " + phoneNumber));
        } catch (Exception e) {
            log.error("Failed to send verification code: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SendSmsError", "Failed to send verification code: " + e.getMessage()));
        }
    }

     */

    @Operation(summary = "비밀번호 찾기",
            description = "가입된 이메일로 인증번호를 전송받아 새로운 비밀번호로 재설정합니다. \n" +
                    "기존 비밀번호와 새로운 비밀번호는 달라야합니다."+
                    "이메일, 발송된 인증 코드, 그리고 변경할 새로운 비밀번호를 요청 본문에 포함하여 보내야 합니다.\n\n" +
                    "Example request body:\n" +
                    "```\n" +
                    "{\n" +
                    "  \"email\": \"example@example.com\",\n" +
                    "  \"verificationCode\": \"발송된 인증 코드\",\n" +
                    "  \"newPassword\": \"변경 할 비밀번호\"\n" +
                    "}\n" +
                    "```")
    @PutMapping("/reset")
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


    @PutMapping("/changePassword")
    @Operation(summary = "마이페이지 비밀번호 변경", description = "로그인된 사용자가 자신의 비밀번호를 입력하여 비밀번호 변경을 진행합니다. Headers에서 Authorization를 Key로 하고 " +
            "Bearer <accessToken> 값을 Value로 하여 유저를 검증하고, 유저의 비밀번호를 입력받아 변경을 진행합니다. 패스워드는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자, 특수문자 포함\n\n" +
            "예시 요청:\n\n" +
            "Headers:\n" +
            "```\n" +
            "Authorization: Bearer <accessToken>\n" +
            "Content-Type: application/json\n" +
            "```\n\n" +
            "Body (JSON):\n" +
            "```\n" +
            "{\n" +
            "    \"currentPassword\": \"current_password_here\",\n" +
            "    \"newPassword\": \"new_password_here\"\n" +
            "}\n" +
            "```")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody PasswordChangeDto passwordChangeDto, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            log.debug("Change password request received.");

            // Header에서 토큰 값 검증
            String accessToken = authorizationHeader.substring(7); // Remove "Bearer " prefix
            log.debug("accessToken => " + accessToken);

            ApiResponse response = memberService.changePassword(passwordChangeDto, accessToken);

            log.debug("Change password request processed successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing change password request.", e);
            return ResponseEntity.status(500).body(ApiResponse.error("ServerError", "Failed to change password: " + e.getMessage()));
        }
    }
}