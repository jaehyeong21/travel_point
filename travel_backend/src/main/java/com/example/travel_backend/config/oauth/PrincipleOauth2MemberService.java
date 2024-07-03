package com.example.travel_backend.config.oauth;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.config.oauth.provider.GoogleMemberInfo;
import com.example.travel_backend.config.oauth.provider.NaverMemberInfo;
import com.example.travel_backend.config.oauth.provider.OAuth2MemberInfo;
import com.example.travel_backend.jwt.JwtToken;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
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
            oAuth2MemberInfo = new NaverMemberInfo((Map) oAuth2User.getAttributes().get("response"));
            log.info("Processing Naver login for user: {}", oAuth2MemberInfo.getEmail());
        } else {
            log.error("Unsupported provider: {}", userRequest.getClientRegistration().getRegistrationId());
            throw new OAuth2AuthenticationException("Unsupported provider");
        }

        String provider = oAuth2MemberInfo.getProvider();
        String providerId = oAuth2MemberInfo.getProviderId();
        String username = provider + "_" + providerId; // 예: google_sub
        String password = bCryptPasswordEncoder.encode("겟인데어"); // 기본 비밀번호 설정
        String userImgUrl = oAuth2MemberInfo.getUserImgUrl();
        String email = oAuth2MemberInfo.getEmail();
        String role = "ROLE_USER";

        Optional<Member> userEntityOptional = memberRepository.findByEmail(email);
        Member userEntity;

        if (userEntityOptional.isPresent()) {
            userEntity = userEntityOptional.get();
            if (userEntity.getProvider() == null || userEntity.getProvider().equals(provider)) {
                log.info("Existing user found. Updating information for user: {}", email);
                userEntity.setUserImgUrl(userImgUrl);
                userEntity.setProvider(provider); // Ensure provider is set
                memberRepository.save(userEntity);
            } else {
                log.error("Email {} already registered with different provider", email);
                throw new OAuth2AuthenticationException("Email already registered with different provider");
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
        }

        PrincipalDetails principalDetails = new PrincipalDetails(userEntity, oAuth2User.getAttributes());
        log.info("PrincipalDetails.getName(): {}", principalDetails.getName()); // 이 부분 추가
        Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
        log.info("Generated JWT token for user: {}", email);

        // OAuth2AuthorizedClient 생성
        OAuth2AuthorizedClient authorizedClient = new OAuth2AuthorizedClient(
                userRequest.getClientRegistration(),
                principalDetails.getName(), // principalName
                userRequest.getAccessToken()
        );

        log.info("Saving OAuth2AuthorizedClient with clientRegistrationId: {}, principalName: {}, accessToken: {}",
                userRequest.getClientRegistration().getRegistrationId(), principalDetails.getName(), userRequest.getAccessToken().getTokenValue());

        authorizedClientService.saveAuthorizedClient(authorizedClient, authentication);

        return new PrincipalDetails(userEntity, oAuth2User.getAttributes(), jwtToken);
    }
}