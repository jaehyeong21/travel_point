package com.example.travel_backend.config.oauth;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.config.oauth.provider.GoogleMemberInfo;
import com.example.travel_backend.config.oauth.provider.NaverMemberInfo;
import com.example.travel_backend.config.oauth.provider.OAuth2MemberInfo;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class PrincipleOauth2MemberService extends DefaultOAuth2UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private HttpServletResponse httpServletResponse;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("Received OAuth2 login request from provider: {}", userRequest.getClientRegistration().getRegistrationId());

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("Loaded user attributes: {}", oAuth2User.getAttributes());

        OAuth2MemberInfo oAuth2MemberInfo;
        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            oAuth2MemberInfo = new GoogleMemberInfo(oAuth2User.getAttributes());
            log.info("Processing Google login for user: {}", oAuth2MemberInfo.getEmail());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            log.info("Naver attributes map: {}", oAuth2User.getAttributes());
            oAuth2MemberInfo = new NaverMemberInfo(oAuth2User.getAttributes());
            log.info("Processing Naver login for user: {}", oAuth2MemberInfo.getEmail());
        } else {
            log.error("Unsupported provider: {}", userRequest.getClientRegistration().getRegistrationId());
            throw new OAuth2AuthenticationException("Unsupported provider");
        }

        log.info("OAuth2 Member Info: {}", oAuth2MemberInfo);

        String provider = oAuth2MemberInfo.getProvider();
        String providerId = oAuth2MemberInfo.getProviderId();
        String username = provider + "_" + providerId;
        String password = bCryptPasswordEncoder.encode("겟인데어");
        String userImgUrl = oAuth2MemberInfo.getUserImgUrl();
        String email = oAuth2MemberInfo.getEmail();
        String role = "ROLE_USER";

        if (email == null || email.isEmpty()) {
            log.error("Email is null or empty. Aborting.");
            throw new OAuth2AuthenticationException("Email is null or empty");
        }

        Optional<Member> userEntityOptional = memberRepository.findByEmail(email);
        Member userEntity;

        if (userEntityOptional.isPresent()) {
            userEntity = userEntityOptional.get();
            log.info("Before update: userEntity = {}", userEntity);
            if (userEntity.getProvider() == null || userEntity.getProvider().equals(provider)) {
                log.info("Existing user found. Updating information for user: {}", email);
                if (userImgUrl != null) {
                    userEntity.setUserImgUrl(userImgUrl);
                }
                userEntity.setProvider(provider);
                userEntity.setProviderId(providerId);
                userEntity.setUsername(username);
                userEntity.setPassword(password);
                userEntity.setRole(role);
                memberRepository.save(userEntity);
                log.info("After update: userEntity = {}", userEntity);
            } else {
                log.info("Email {} already registered with a different provider. Skipping update.", email);
            }
        } else {
            log.info("No existing user found. Creating new user: {}", email);
            userEntity = Member.builder()
                    .username(username)
                    .password(password)
                    .userImgUrl(userImgUrl)
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            memberRepository.save(userEntity);
            log.info("New user created: userEntity = {}", userEntity);
        }

        PrincipalDetails principalDetails = new PrincipalDetails(userEntity, oAuth2User.getAttributes());
        log.info("PrincipalDetails.getName(): {}", principalDetails.getName());
        Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
        log.info("Generated JWT token for user: {}", email);

        // OAuth2AuthorizedClient 생성
        OAuth2AuthorizedClient authorizedClient = new OAuth2AuthorizedClient(
                userRequest.getClientRegistration(),
                principalDetails.getName(),
                userRequest.getAccessToken()
        );


        authorizedClientService.saveAuthorizedClient(authorizedClient, authentication);

        // Refresh Token을 HttpOnly, Secure 옵션을 적용하여 쿠키에 저장
        log.info("Creating refresh token cookie for user: {}", email);
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); // HTTPS 사용 시 적용
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
        httpServletResponse.addCookie(refreshTokenCookie);
        log.info("Refresh token cookie created and added to response for user: {}", email);

        return new PrincipalDetails(userEntity, oAuth2User.getAttributes(), jwtToken);
    }

}