package com.example.travel_backend.controller.favorite;


import com.example.travel_backend.data.ApiResponse;
import com.example.travel_backend.data.FavoritesDTO;
import com.example.travel_backend.jwt.JwtTokenProvider;
import com.example.travel_backend.model.Favorites;
import com.example.travel_backend.service.FavoritesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "Favorites", description = "Favorites API")
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoritesController {

    private final FavoritesService favoritesService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "찜하기 추가",
            description = "회원 ID와 목적지 ID를 사용하여 찜하기를 추가합니다.\n\n" +
                    "Example request parameters:\n" +
                    "`memberId=1&destinationId=1`")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addFavorite(@RequestParam int memberId, @RequestParam int destinationId) {
        try {
            Favorites favorite = favoritesService.addFavorite(memberId, destinationId);
            return ResponseEntity.ok(ApiResponse.success(favorite));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "회원별 찜하기 조회",
            description = "회원 ID를 사용하여 해당 회원의 모든 찜하기 목록을 조회합니다.\n\n" +
                    "Example request parameter:\n" +
                    "`memberId=1`")
    @GetMapping("/member/{memberId}")
    public ResponseEntity<ApiResponse> getFavoritesByMember(@PathVariable int memberId) {
        try {
            List<FavoritesDTO> favorites = favoritesService.getFavoritesByMember(memberId);
            return ResponseEntity.ok(ApiResponse.success(favorites));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "찜하기 여부 확인", description = "회원 ID와 목적지 ID를 사용하여 찜하기 여부를 확인합니다.")
    @GetMapping("/isFavorite")
    public ResponseEntity<ApiResponse> isFavorite(@RequestParam int memberId, @RequestParam int destinationId) {
        try {
            boolean isFavorite = favoritesService.isFavorite(memberId, destinationId);
            return ResponseEntity.ok(ApiResponse.success(isFavorite));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }

    @Operation(summary = "찜하기 삭제",
            description = "찜하기 ID를 사용하여 찜하기 목록을 삭제합니다.\n\n" +
                    "Example request parameter:\n" +
                    "`favoriteId=4`")
    @DeleteMapping("/delete/{favoriteId}")
    public ResponseEntity<ApiResponse> deleteFavorite(@PathVariable int favoriteId, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
            favoritesService.deleteFavorite(favoriteId, token);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("NOT_FOUND", e.getMessage()));
        }
    }
}
