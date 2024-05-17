package com.example.travel_backend.config.oauth;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.config.oauth.provider.GoogleUserInfo;
import com.example.travel_backend.config.oauth.provider.NaverUserInfo;
import com.example.travel_backend.config.oauth.provider.OAuth2UserInfo;
import com.example.travel_backend.model.User;
import com.example.travel_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service //타입은 정해져있다.  -> DefaultOAuth2UserService
public class PrincipleOauth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    //구글로부터 받은 userRuest 데이터에 대한 후 처리가 되는 함수
    //함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override 
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("user Request ==> " + userRequest);
        System.out.println("userRequest.getAccessToken() ==> " + userRequest.getAccessToken());
        System.out.println("getTokenValue ==> " + userRequest.getAccessToken().getTokenValue());
        System.out.println("getClientRegistration() ==> " + userRequest.getClientRegistration()); //registration으로 어떤 OAuth로 로그인 했는지 확인 가능
        /*
            구글 로그인 버튼 클릭 -> 구글 로그인 창 -> 로그인 완료 -> code를 리턴(OAuth2-Client 라이브러리) -> AccessToken을 요청
                                        --------여기까지가 userRequest정보-------
            userRequest정보 -> loadUser함수 호출-> 회원 프로필(구글로부터)
         */
        System.out.println("userRequest.getClientRegistration().getClientId() ==> " + userRequest.getClientRegistration().getClientId());

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("getAttributes ==>" + oAuth2User.getAttributes());

        //회원가입을 진행
        OAuth2UserInfo oAuth2UserInfo = null;
        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            System.out.println("===========구글 요청============");
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            System.out.println("===========네이버 요청============");
            //리턴타입이 Map이된다.
            oAuth2UserInfo = new NaverUserInfo((Map)oAuth2User.getAttributes().get("response"));
        }
//        String provider = userRequest.getClientRegistration().getRegistrationId(); //google
        String provider = oAuth2UserInfo.getProvider();
//        String providerId = oAuth2User.getAttribute("sub");
        String providerId = oAuth2UserInfo.getProviderId();
        String username = provider + "_" + providerId; // google_sub
        String password = bCryptPasswordEncoder.encode("겟인데어");
        String userImgUrl = oAuth2UserInfo.getUserImgUrl();
//        String email = oAuth2User.getAttribute("email");
        String email = oAuth2UserInfo.getEmail();
        String role = "ROLE_USER";

        User userEntity = userRepository.findByUsername(username);
        if (userEntity == null) {
            userEntity = User.builder()
                    .username(username)
                    .password(password)
                    .userImgUrl(userImgUrl)
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            userRepository.save(userEntity);
        }

        return new PrincipalDetails(userEntity, oAuth2User.getAttributes());
//        return super.loadUser(userRequest);
    }
}
