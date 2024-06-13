package com.example.travel_backend.validator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailValidator {
    // 이메일 형식을 검증하는 정규 표현식
    private static final String EMAIL_PATTERN =
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$";

    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
