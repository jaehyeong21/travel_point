package com.example.travel_backend.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "parkjuncheol77@gmail.com";

    // 저장된 인증 코드를 관리하기 위한 Map
    private Map<String, String> verificationCodes = new HashMap<>();

    // 랜덤으로 숫자 생성
    public String createNumber() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 8; i++) { // 인증 코드 8자리
            int index = random.nextInt(3); // 0~2까지 랜덤, 랜덤값으로 switch문 실행

            switch (index) {
                case 0 -> key.append((char) (random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char) (random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10)); // 숫자
            }
        }
        return key.toString();
    }

    // 회원가입을 위한 이메일 인증 코드 발송
    public void sendVerificationEmail(String email) throws MessagingException {
        String verificationCode = createNumber(); // 랜덤 인증번호 생성

        MimeMessage message = createMail(email, verificationCode, "회원가입"); // 메일 생성
        try {
            javaMailSender.send(message); // 메일 발송
        } catch (MailException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("메일 발송 중 오류가 발생했습니다.");
        }

        // 생성된 인증번호를 저장
        verificationCodes.put(email, verificationCode);
    }

    // 비밀번호 재설정을 위한 이메일 인증 코드 발송
    public void sendPasswordResetEmail(String email) throws MessagingException {
        String verificationCode = createNumber(); // 랜덤 인증번호 생성

        MimeMessage message = createMail(email, verificationCode, "비밀번호 재설정"); // 메일 생성
        try {
            javaMailSender.send(message); // 메일 발송
        } catch (MailException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("메일 발송 중 오류가 발생했습니다.");
        }

        // 생성된 인증번호를 저장
        verificationCodes.put(email, verificationCode);
    }

    // 이메일 생성
    private MimeMessage createMail(String recipient, String verificationCode, String subject) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, recipient);
        message.setSubject(subject);
        String body = "<h3>요청하신 인증 번호입니다.</h3>"
                + "<h1>" + verificationCode + "</h1>"
                + "<h3>감사합니다.</h3>";
        message.setText(body, "UTF-8", "html");

        return message;
    }

    // 저장된 인증 코드 가져오기
    public String getStoredVerificationCode(String email) {
        return verificationCodes.get(email);
    }
}
