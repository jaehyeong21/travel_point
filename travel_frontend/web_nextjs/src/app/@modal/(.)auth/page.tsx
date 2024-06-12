'use client';
import AuthPage from '@/components/section/auth/auth-page';
import React, { useEffect, useState } from 'react';

export default function InterceptPage() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // 초기 화면 크기 설정
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 640); // 'sm' 사이즈 이하
      };

      handleResize(); // 초기 실행
      window.addEventListener('resize', handleResize); // 윈도우 리사이즈 이벤트 리스너 추가

      return () => {
        window.removeEventListener('resize', handleResize); // 정리
      };
    }
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      window.location.href = '/auth'; // 'sm' 사이즈 이하일 때 auth 페이지로 강제 리다이렉트
    }
  }, [isSmallScreen]);

  if (isSmallScreen) {
    return null; // 리다이렉트 중에 아무것도 렌더링하지 않음
  }

  return (
    <AuthPage isModal />
  );
}