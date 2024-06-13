import { fetchFromAuthApi } from "@/services/fetch-api";

// 로그인 API 요청 함수
export async function loginApi(data: { email: string, password: string }) {
  const url = '/api/loginForm';
  return fetchFromAuthApi(url, data);
}
// 회원가입 API 요청 함수
export async function registerApi(data: { email: string, password: string }) {
  const url = '/api/join';
  return fetchFromAuthApi(url, data);
}