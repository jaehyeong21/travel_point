package com.example.travel_backend.service;

import com.example.travel_backend.data.FavoritesDTO;
import com.example.travel_backend.jwt.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.travel_backend.model.Destination;
import com.example.travel_backend.model.Favorites;
import com.example.travel_backend.model.Member;
import com.example.travel_backend.repository.DestinationRepository;
import com.example.travel_backend.repository.FavoritesRepository;
import com.example.travel_backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FavoritesService {
    private static final Logger logger = LoggerFactory.getLogger(FavoritesService.class);

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    //찜목록 추가
    @Transactional
    public Favorites addFavorite(int memberId, int destinationId) {
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (!memberOptional.isPresent()) {
            logger.error("Member not found for ID: " + memberId);
            throw new RuntimeException("Member not found for ID: " + memberId);
        }
        Member member = memberOptional.get();

        Optional<Destination> destinationOptional = destinationRepository.findById((long) destinationId);
        if (!destinationOptional.isPresent()) {
            logger.error("Destination not found for ID: " + destinationId);
            throw new RuntimeException("Destination not found for ID: " + destinationId);
        }
        Destination destination = destinationOptional.get();

        Favorites favorite = Favorites.builder()
                .member(member)
                .destination(destination)
                .build();

        return favoritesRepository.save(favorite);
    }

    //찜하기 목록 불러오기
    @Transactional(readOnly = true)
    public List<FavoritesDTO> getFavoritesByMember(int memberId) {
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (!memberOptional.isPresent()) {
            logger.error("Member not found for ID: " + memberId);
            throw new RuntimeException("Member not found for ID: " + memberId);
        }
        Member member = memberOptional.get();

        List<Favorites> favoritesList = favoritesRepository.findByMember(member);
        logger.info("Favorites found: " + favoritesList.size());

        List<FavoritesDTO> favoritesDTOList = new ArrayList<>();
        for (Favorites fav : favoritesList) {
            FavoritesDTO dto = new FavoritesDTO();
            dto.setFavoriteId(fav.getFavoriteId());
            dto.setMemberId(fav.getMember().getId());
            dto.setMemberUsername(fav.getMember().getUsername());
            dto.setDestinationId(fav.getDestination().getDestinationId());
            dto.setDestinationTitle(fav.getDestination().getTitle());
            dto.setDestinationLocation(fav.getDestination().getLocation());
            dto.setDestinationDescription(fav.getDestination().getDestinationDescription());
            dto.setDestinationFirstImage(fav.getDestination().getFirstimage());
            dto.setContentId(fav.getDestination().getContentId());
            favoritesDTOList.add(dto);
        }

        return favoritesDTOList;
    }

    //찜하기 목록 삭제
    @Transactional
    public void deleteFavorite(int favoriteId, String accessToken) {
        String email = jwtTokenProvider.getUsernameFromToken(accessToken);
        Optional<Member> memberOptional = memberRepository.findByEmail(email);

        if (!memberOptional.isPresent()) {
            logger.error("Member not found for email: " + email);
            throw new RuntimeException("Member not found for email: " + email);
        }

        Member member = memberOptional.get();
        Optional<Favorites> favoriteOptional = favoritesRepository.findById(favoriteId);

        if (!favoriteOptional.isPresent()) {
            logger.error("Favorite not found for ID: " + favoriteId);
            throw new RuntimeException("Favorite not found for ID: " + favoriteId);
        }

        Favorites favorite = favoriteOptional.get();

        if (favorite.getMember().getId() != member.getId()) {
            logger.error("Unauthorized attempt to delete favorite with ID: " + favoriteId);
            throw new RuntimeException("Unauthorized attempt to delete favorite with ID: " + favoriteId);
        }

        favoritesRepository.deleteById(favoriteId);
        logger.info("Favorite with ID " + favoriteId + " has been deleted.");
    }

    //찜하기 여부 확인
    @Transactional(readOnly = true)
    public boolean isFavorite(int memberId, int destinationId) {
        Optional<Member> memberOptional = memberRepository.findById(memberId);
        if (!memberOptional.isPresent()) {
            logger.error("Member not found for ID: " + memberId);
            throw new RuntimeException("Member not found for ID: " + memberId);
        }
        Member member = memberOptional.get();

        Optional<Destination> destinationOptional = destinationRepository.findById((long) destinationId);
        if (!destinationOptional.isPresent()) {
            logger.error("Destination not found for ID: " + destinationId);
            throw new RuntimeException("Destination not found for ID: " + destinationId);
        }

        return favoritesRepository.existsByMemberAndDestination(member, destinationOptional.get());
    }

    // 회원의 모든 찜 목록 삭제
    @Transactional
    public void deleteAllFavoritesByMemberId(int memberId) {
        favoritesRepository.deleteByMemberId(memberId);
    }
}