package com.example.travel_backend.config.oauth.provider;

import java.util.Map;

public class GoogleMemberInfo implements OAuth2MemberInfo {

    private Map<String, Object> attributes; //oauth2User.getAttributes()

    public GoogleMemberInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProviderId() {
        return (String)attributes.get("sub");
    }

    @Override
    public String getProvider() {
        return "google";
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
        return (String)attributes.get("picture");
    }
}
