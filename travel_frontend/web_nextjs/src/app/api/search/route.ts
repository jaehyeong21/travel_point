// @/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

// 비동기 작업을 별도의 함수로 분리
async function fetchFromNaverAPI(query: string) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_SEARCH_ID;
  const clientSecret = process.env.NEXT_PUBLIC_NAVER_SEARCH_KEY;

  if (!clientId || !clientSecret) {
    throw new Error("API credentials are not defined in environment variables.");
  }
  const url = `https://openapi.naver.com/v1/search/blog?query=${encodeURIComponent(query)}&display=4&start=1&sort=sim`;
  const headers = {
    "X-Naver-Client-Id": clientId,
    "X-Naver-Client-Secret": clientSecret,
    "Content-Type": "application/json",
  };  

  const apiResponse = await fetch(url, { headers, cache: "no-cache" });
  if (!apiResponse.ok) {
    throw new Error(`Failed to fetch data from Naver API: ${apiResponse.statusText}`);
  }

  return apiResponse.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return new NextResponse(JSON.stringify({ error: "Query parameter is missing." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Naver API에서 데이터 가져오기
    const data = await fetchFromNaverAPI(query);
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(message);
    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
