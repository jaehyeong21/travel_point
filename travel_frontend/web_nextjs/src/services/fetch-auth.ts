import { fetchFromAuthApi } from "@/services/fetch-api";

// 로그인 API 요청 함수
export async function loginApi(data: { email: string; password: string }) {
  const url = "/api/loginForm";
  return fetchFromAuthApi(url, data);
}

// 회원가입 API 요청 함수
export async function registerApi(data: { email: string; password: string }) {
  const url = "/api/signup/request";
  return fetchFromAuthApi(url, data, "POST");
}
// 회원가입 API 최종(이메일 인증) 요청
export async function registerVerificationApi(data: {
  email: string;
  password: string;
  verificationCode: string;
}) {
  const url = "/api/signup/verify";
  return fetchFromAuthApi(url, data, "POST");
}

// 회원 탈퇴 요청
export async function deleteAccountApi(password: string) {
  const url = "/api/deleteAccount";
  return fetchFromAuthApi(url, { password }, "DELETE");
}

// 비밀번호 찾기 요청(인증 번호 요청)
export async function findPasswordVeriApi(data: { email: string }) {
  const url = "/api/password/reset-request/email";
  return fetchFromAuthApi(url, data, "POST");
}

// 비밀번호 최종 찾기->변경 요청
export async function findPasswordApi(data: {
  email: string;
  newPassword: string;
  verificationCode: string;
}) {
  const url = "/api/password/reset";
  return fetchFromAuthApi(url, data, "PUT");
}

// 마이페이지 비밀번호 변경
export async function changePasswordApi(
  currentPassword: string,
  newPassword: string
) {
  return await fetchFromAuthApi(
    "/api/password/changePassword",
    { currentPassword, newPassword },
    "PUT"
  );
}

// 이미지 업로드
export async function uploadImage(imageUrl: string) {
  return await fetchFromAuthApi("/api/uploadImage", { imageUrl }, "POST");
}

// 찜하기 확인
export async function isBookmarked(memberId: number, destinationId: number) {
  return await fetchFromAuthApi(
    "/api/favorites/isFavorite",
    { memberId, destinationId },
    "GET",
    `?memberId=${memberId}&destinationId=${destinationId}`
  );
}

// 찜 추가하기
export async function bookMarkDestination(
  memberId: number,
  destinationId: number
) {
  return await fetchFromAuthApi(
    "/api/favorites/add",
    { memberId, destinationId },
    "POST",
    `?memberId=${memberId}&destinationId=${destinationId}`
  );
}

// 마이페이지 찜하기 확인
export async function checkBookmarkbyId(
  memberId: number,
  destinationId: number
) {
  return await fetchFromAuthApi(
    "/api/favorites/member",
    { memberId, destinationId },
    "GET",
    `/${memberId}`
  );
}

// 찜하기 1개 삭제
export async function deleteBookmarkbyId(
  memberId: number,
  destinationId: number
) {
  return await fetchFromAuthApi(
    "/api/favorites/delete",
    { memberId, destinationId },
    "DELETE",
    `?memberId=${memberId}&destinationId=${destinationId}`
  );
}

// 찜하기 전체 삭제
export async function deleteBookmarkAll(memberId: number) {
  return await fetchFromAuthApi(
    "/api/favorites/deleteAll",
    { memberId },
    "DELETE",
    `/${memberId}`
  );
}

// accessToken 갱신
export async function newAccessToken() {
  return await fetchFromAuthApi("/api/refresh", null, "POST");
}

// refreshToken 확인하기
export async function hasRefreshToken() {
  return await fetchFromAuthApi("/api/refreshToken/exists", null, "GET");
}
