package com.example.travel_backend.config.oauth;

import com.example.travel_backend.config.auth.PrincipalDetails;
import com.example.travel_backend.config.oauth.provider.GoogleMemberInfo;
import com.example.travel_backend.config.oauth.provider.NaverMemberInfo;
import com.example.travel_backend.config.oauth.provider.OAuth2MemberInfo;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service //타입은 정해져있다.  -> DefaultOAuth2UserService
public class PrincipleOauth2MemberService extends DefaultOAuth2UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MemberRepository memberRepository;

    //구글로부터 받은 userRuest 데이터에 대한 후 처리가 되는 함수
    //함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override 
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        /*
            구글 로그인 버튼 클릭 -> 구글 로그인 창 -> 로그인 완료 -> code를 리턴(OAuth2-Client 라이브러리) -> AccessToken을 요청
                                        --------여기까지가 userRequest정보-------
            userRequest정보 -> loadUser함수 호출-> 회원 프로필(구글로부터)
         */
        System.out.println("userRequest.getClientRegistration().getClientId() ==> " + userRequest.getClientRegistration().getClientId());

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("getAttributes ==>" + oAuth2User.getAttributes());

        //회원가입을 진행
        OAuth2MemberInfo oAuth2MemberInfo = null;
        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            System.out.println("===========구글 요청============");
            oAuth2MemberInfo = new GoogleMemberInfo(oAuth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            System.out.println("===========네이버 요청============");
            //리턴타입이 Map이된다.
            oAuth2MemberInfo = new NaverMemberInfo((Map) oAuth2User.getAttributes().get("response"));
        }
//        String provider = userRequest.getClientRegistration().getRegistrationId(); //google
        String provider = oAuth2MemberInfo.getProvider();
//        String providerId = oAuth2User.getAttribute("sub");
        String providerId = oAuth2MemberInfo.getProviderId();
        String username = provider + "_" + providerId; // google_sub
        String password = bCryptPasswordEncoder.encode("겟인데어");
        String userImgUrl = oAuth2MemberInfo.getUserImgUrl();
//        String email = oAuth2User.getAttribute("email");
        String email = oAuth2MemberInfo.getEmail();
        String role = "ROLE_USER";

//        Member userEntity = memberRepository.findByUsername(username);
//        if (userEntity == null) {
//            userEntity = Member.builder()
//                    .username(username)
//                    .password(password)
//                    .userImgUrl(userImgUrl)
//                    .email(email)
//                    .role(role)
//                    .provider(provider)
//                    .providerId(providerId)
//                    .build();
//            memberRepository.save(userEntity);
//        }
//
//        return new PrincipalDetails(userEntity, oAuth2User.getAttributes());
//        return super.loadUser(userRequest);

        Optional<Member> userEntityOptional = memberRepository.findByUsername(username);

        Member userEntity = userEntityOptional.orElseGet(() -> {
            System.out.println("사용자가 존재하지 않으므로 새 사용자 생성");
            Member newUser = Member.builder()
                    .username(username)
                    .password(password) // 비밀번호는 인코딩하여 저장
                    .userImgUrl(userImgUrl)
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            return memberRepository.save(newUser);
        });
        return new PrincipalDetails(userEntity);
    }

}
