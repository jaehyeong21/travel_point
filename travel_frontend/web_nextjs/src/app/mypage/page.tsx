// app/mypage/page.tsx
import React, { Suspense } from 'react';
import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import MypageFooter from '@/components/section/mypage/mypage-footer';
import { Metadata } from 'next';
import MyPageContent from '@/components/section/mypage/mypage-content';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '내 정보 확인, 찜한 여행지, 리뷰, 최근 본 여행지 확인 및 회원 탈퇴가 가능한 마이페이지 페이지입니다'
};

export default async function MyPage() {
  return (
    <main>
      <HeroSection page='mypage' title='마이페이지' subtitle='환영합니다' />
      <PageLayout className='px-0 sm:px-6 xl:px-0' option='70dvh'>
        <Suspense fallback={<div>Loading...</div>}>
          <MyPageContent />
        </Suspense>
      </PageLayout>
      {/* 마이페이지 하단 - 회원탈퇴,비밀번호변경,로그아웃 */}
      <MypageFooter />
    </main>
  );
}
