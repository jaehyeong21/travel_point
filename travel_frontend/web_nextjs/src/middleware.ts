import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // 쿠키에서 accessToken을 가져옵니다.
  const token = request.cookies.get('accessToken');

  // 토큰이 없으면 로그인 페이지로 리디렉션합니다.
  if (!token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 토큰이 있으면 요청을 계속 처리합니다.
  return NextResponse.next();
}

// 특정 경로에 대해서만 미들웨어가 작동하도록 설정합니다.
export const config = {
  matcher: ['/mypage/:path*'],
};
