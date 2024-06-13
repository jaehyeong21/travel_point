import React from 'react';
import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import { Separator } from '@/components/ui/separator';
import MypageFooter from '@/components/section/mypage/mypage-footer';
import { UserProfile } from '@/components/section/mypage/user-profile';
import { Metadata } from 'next';
import MypageTabSection from '@/components/section/mypage/mypage-tab-section';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '내 정보 확인, 찜한 여행지, 리뷰, 최근 본 여행지 확인 및 회원 탈퇴가 가능한 마이페이지 페이지입니다'
};

interface MypageProps {
  params: { slug: string }
}

export default function MyPage({ params }: MypageProps) {
  return (
    <main>
      <HeroSection page='mypage' title='마이페이지' subtitle={`${params.slug}님 환영합니다.`} />
      <PageLayout className='px-0 sm:px-6 xl:px-0'>
        {/* 유저 프로필 정보 */}
        <UserProfile params={params} />
        {/* 유저 탭 색션 */}
        <MypageTabSection />
        <Separator />
      </PageLayout>
      {/* 회원 탈퇴, 로그아웃 */}
      <MypageFooter />
    </main>
  );
}
