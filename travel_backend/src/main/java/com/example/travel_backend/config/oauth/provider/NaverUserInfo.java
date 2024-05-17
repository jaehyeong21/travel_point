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
public class NaverUserInfo implements OAuth2UserInfo{

    private Map<String, Object> attributes; //oauth2User.getAttributes()

    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProviderId() {
        return (String)attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getEmail() {
        return (String)attributes.get("email");
    }

    @Override
    public String getName() {
        return (String)attributes.get("name");
    }

    @Override
    public String getUserImgUrl() {
        return (String)attributes.get("profile_image");
    }
}
