package com.example.travel_backend.controller.mail;

import com.example.travel_backend.data.MailDto;
import com.example.travel_backend.service.MailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@Tag(name = "이메일 인증", description = "이메일 인증이 가능합니다.")
@RestController
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @Operation(summary = "이메일 인증", description = "이메일 인증이 필요한 경우 인증 코드를 발송합니다.")
    @ResponseBody
    @PostMapping("/emailCheck")
    public ResponseEntity<String> emailCheck(@RequestBody MailDto mailDto) {
        try {
            mailService.sendVerificationEmail(mailDto.getEmail());
            return ResponseEntity.ok("Verification email sent successfully");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send verification email: " + e.getMessage());
        }
    }
}

