package com.example.travel_backend.config.oauth.provider;

import java.util.Map;


/*
{resultcode=00, message=success,
response={id=,
            nickname=,
            profile_image=,
            email=,
            name= }}
 */
public class NaverMemberInfo implements OAuth2MemberInfo {

    private final Map<String, Object> response;

    public NaverMemberInfo(Map<String, Object> attributes) {
        if (attributes.containsKey("response")) {
            this.response = (Map<String, Object>) attributes.get("response");
        } else {
            throw new IllegalArgumentException("Response attribute is missing");
        }
    }

    @Override
    public String getProviderId() {
        return (String) response.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getEmail() {
        return (String) response.get("email");
    }

    @Override
    public String getName() {
        return (String) response.get("name");
    }

    @Override
    public String getUserImgUrl() {
        return (String) response.get("profile_image");
    }
}