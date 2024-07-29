// src/services/fetch-api.ts

import { getCookie } from "@/libs/cookie";

// DB API 설정
const username = process.env.NEXT_PUBLIC_API_USERNAME;
const password = process.env.NEXT_PUBLIC_API_PASSWORD;

// 공통 GET API 요청 함수
export async function fetchFromApi(
  endpoint: string,
  params: Record<string, string | undefined>
) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_BASE_URL;

  // undefined 또는 빈 문자열 값을 제거하고 URLSearchParams 생성
  const filteredParams: Record<string, string> = {};
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== "") {
      filteredParams[key] = params[key]!;
    }
  }

  const urlParams = new URLSearchParams(filteredParams);
  const queryString = urlParams.toString();
  const url = queryString
    ? `${baseUrl}${endpoint}?${queryString}`
    : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: "Basic " + btoa(`${username}:${password}`),
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  return response.json();
}

// 공통 API 요청 함수
// services/fetch-auth.ts
export async function fetchFromAuthApi(
  url: string,
  data: Record<string, any> | null = null,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
  params?: string
) {
  const accessToken = getCookie("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit = {
    method: method,
    headers: headers,
  };

  if (method !== "GET" && data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(params ? `${url}${params}` : url, fetchOptions);
  console.log(response);
  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    responseData = { message: "JSON parsing error" };
  }

  if (!response.ok) {
    console.error(`API call failed: ${url}`, responseData);
    throw new Error(
      `API call failed with status: ${response.status} - ${
        responseData.message || "Unknown error"
      }`
    );
  }

  return responseData;
}

export async function fetchdWithCredentials(
  url: string,
) {
  const accessToken = getCookie("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: headers,
    credentials: "include",
  };

  const response = await fetch(url, fetchOptions);

  let responseData;
  try {
    responseData = await response.json();
  } catch (error) {
    responseData = { message: "JSON parsing error" };
  }

  if (!response.ok) {
    console.error(`API call failed: ${url}`, responseData);
    throw new Error(
      `API call failed with status: ${response.status} - ${
        responseData.message || "Unknown error"
      }`
    );
  }

  return responseData;
}
