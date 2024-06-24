import { fetchFromAuthApi } from "@/services/fetch-api";

// 리뷰 생성
export async function createReview(reviewData: {
  content: string;
  rate: number;
  destinationId: number;
  imageUrl: string;
}) {
  return await fetchFromAuthApi("/api/reviews", reviewData, "POST");
}

// 리뷰 수정
export async function modifyReview(
  id: number,
  reviewData: Record<string, any>
) {
  return await fetchFromAuthApi(`/api/reviews/modify/${id}`, reviewData, "PUT");
}

// 특정 목적지의 리뷰 조회
export async function getReviewsByDestination(destinationId: number) {
  return await fetchFromAuthApi(
    `/api/reviews/destination/${destinationId}`,
    null,
    "GET"
  );
}
// 리뷰 삭제
export async function deleteReview(id: number) {
  return await fetchFromAuthApi(`/api/reviews/delete/${id}`, null, "DELETE");
}

// 특정 목적지의 별점 평점 조회
export async function getRatingsByDestination(destinationId: number) {
  return await fetchFromAuthApi(
    `/api/reviews/destination/${destinationId}/ratings`,
    null,
    "GET"
  );
}
// 특정 목적지의 총 리뷰 갯수 조회
export async function getReviewCountByDestination(destinationId: number) {
  return await fetchFromAuthApi(
    `/api/reviews/destination/${destinationId}/count`,
    null,
    "GET"
  );
}

// 특정 목적지의 리뷰를 별점 높은 순으로 조회
export async function getReviewsByDestinationRateDesc(destinationId: number) {
  return await fetchFromAuthApi(
    `/api/reviews/destination/${destinationId}/rate-desc`,
    null,
    "GET"
  );
}

// 특정 목적지의 리뷰를 별점 낮은 순으로 조회
export async function getReviewsByDestinationRateAsc(destinationId: number) {
  return await fetchFromAuthApi(
    `/api/reviews/destination/${destinationId}/rate-asc`,
    null,
    "GET"
  );
}
