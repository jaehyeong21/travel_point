package com.example.travel_backend.repository;

import com.example.travel_backend.model.Destination;
import com.example.travel_backend.model.Favorites;
import com.example.travel_backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritesRepository extends JpaRepository<Favorites, Integer> {

    // 특정 회원의 찜 목록 조회
    List<Favorites> findByMember(Member member);

    // 특정 회원과 목적지로 찜 목록 존재 여부 확인
    boolean existsByMemberAndDestination(Member member, Destination destination);


    //특정 회원과 목적지의 찜 목록을 조회하는 메서드
    Optional<Favorites> findByMemberAndDestination(Member member, Destination destination);

    // 특정 회원의 모든 찜 목록 삭제
    void deleteByMemberId(int memberId);


}