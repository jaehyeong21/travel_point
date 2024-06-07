package com.example.travel_backend.config.auth;

import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//시큐리티 설정에서 loginProcessingUrl("/login");'
@Service
public class PrincipalDetailsService implements UserDetailsService {
    @Autowired
    private MemberRepository memberRepository;

    //시큐리티 session(내부 Authentication(내부 UserDetails))
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("username ===>"+ username);
        Member userEntity = memberRepository.findByUsername(username);
        if (userEntity != null) {
            System.out.println("Null이 아닌 경우");
            System.out.println("userEntity==>" + userEntity);
            return new PrincipalDetails(userEntity);
        }
        System.out.println("Null인경우");
        return null;
    }
}
