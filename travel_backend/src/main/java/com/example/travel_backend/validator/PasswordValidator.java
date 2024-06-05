package com.example.travel_backend.validator;

public class PasswordValidator {

    public static boolean isValid(String password) {
        if (password == null) {
            return false;
        }
        // 예시: 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자, 특수문자 포함
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return password.matches(passwordPattern);
    }
}
