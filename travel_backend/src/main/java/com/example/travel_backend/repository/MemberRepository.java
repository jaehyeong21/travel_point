package com.example.travel_backend.repository;

import com.example.travel_backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Member findByUsername(String username);

    Member findByEmail(String email);
}