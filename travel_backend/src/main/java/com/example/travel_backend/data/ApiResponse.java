package com.example.travel_backend.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private boolean response;
    private String errorCode;
    private String message;
    private Object result;

    public static ApiResponse success(Object result) {
        return new ApiResponse(true, null, null, result);
    }

    public static ApiResponse error(String errorCode, String message) {
        return new ApiResponse(false, errorCode, message, null);
    }
}