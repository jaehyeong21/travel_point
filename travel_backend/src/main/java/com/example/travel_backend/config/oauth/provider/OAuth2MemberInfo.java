package com.example.travel_backend.config.oauth.provider;

public interface OAuth2MemberInfo {
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();
    String getUserImgUrl();
}
