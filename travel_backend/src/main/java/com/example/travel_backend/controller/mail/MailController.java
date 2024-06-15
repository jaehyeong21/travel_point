package com.example.travel_backend.controller.mail;

import com.example.travel_backend.data.MailDto;
import com.example.travel_backend.service.MailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @ResponseBody
    @PostMapping("/emailCheck") // 이 부분은 각자 바꿔주시면 됩니다.
    public String emailCheck(@RequestBody MailDto mailDto) throws MessagingException, UnsupportedEncodingException {
        mailService.sendVerificationEmail(mailDto.getEmail());
        return "Verification email sent successfully"; // 성공 메시지를 반환
    }
}
