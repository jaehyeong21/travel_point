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

    /**
     * OAuth2 로그인 요청을 처리하는 메서드
     * @param userRequest OAuth2UserRequest
     * @return OAuth2User
     * @throws OAuth2AuthenticationException
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("Received OAuth2 login request from provider: {}", userRequest.getClientRegistration().getRegistrationId());

        // OAuth2UserRequest에서 사용자 속성 로드
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("Loaded user attributes: {}", oAuth2User.getAttributes());

        // 로그인 제공자에 따라 사용자 정보 처리
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

        // 사용자 정보 설정
        String provider = oAuth2MemberInfo.getProvider();
        String providerId = oAuth2MemberInfo.getProviderId();
        String username = provider + "_" + providerId; // 예: google_sub
        String password = bCryptPasswordEncoder.encode("겟인데어"); // 기본 비밀번호 설정
        String userImgUrl = oAuth2MemberInfo.getUserImgUrl();
        String email = oAuth2MemberInfo.getEmail();
        String role = "ROLE_USER";

        // 이메일로 기존 사용자 조회
        Optional<Member> userEntityOptional = memberRepository.findByEmail(email);
        Member userEntity;

        if (userEntityOptional.isPresent()) {
            userEntity = userEntityOptional.get();
            // 기존 사용자가 같은 제공자로 가입된 경우 정보 업데이트
            if (userEntity.getProvider().equals(provider)) {
                log.info("Existing user found. Updating information for user: {}", email);
                userEntity.setUserImgUrl(userImgUrl);
                memberRepository.save(userEntity);
            } else {
                // 다른 제공자로 가입된 경우 예외 처리
                log.error("Email {} already registered with different provider", email);
                throw new OAuth2AuthenticationException("Email already registered with different provider");
            }
        } else {
            // 새로운 사용자 생성
            log.info("No existing user found. Creating new user: {}", email);
            userEntity = Member.builder()
                    .username(username)
                    .password(password) // 비밀번호는 인코딩하여 저장
                    .userImgUrl(userImgUrl)
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            memberRepository.save(userEntity);
        }

        // JWT 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(userEntity, null, new PrincipalDetails(userEntity).getAuthorities());
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);
        log.info("Generated JWT token for user: {}", email);

        // PrincipalDetails 객체 생성 및 반환
        return new PrincipalDetails(userEntity, oAuth2User.getAttributes(), jwtToken);
    }
}