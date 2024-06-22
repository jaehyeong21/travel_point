package com.example.travel_backend.repository;

import com.example.travel_backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Optional<Member> findByUsername(String username);

    Optional<Member> findByEmail(String email);
}