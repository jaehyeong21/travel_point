'use client';
import React from 'react';
import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import { Separator } from '@/components/ui/separator';
import MypageFooter from '@/components/section/mypage/mypage-footer';
import { UserProfile } from '@/components/section/mypage/user-profile';
import { MypageTabSection } from '@/components/section/mypage/mypage-tab-section';
import { generateData } from '@/libs/utils';
import { usePaginatedData } from '@/hooks/use-pagination';

interface MypageProps {
  params: { slug: string }
}

export default function MyPage({ params }: MypageProps) {
  const itemsPerPage = 6;

  // 데이터 목록 (나중에 데이터 API 추가해야됨.)
  const data = generateData();
  const { currentPage, setCurrentPage, totalPages, paginatedData } = usePaginatedData(data, itemsPerPage);

  return (
    <main>
      <HeroSection page='mypage' title='마이페이지' subtitle={`${params.slug}님 환영합니다.`} />
      <PageLayout>
        <UserProfile params={params} />
        {/* 나중에 탭 별로 변경해야됨 */}
        <MypageTabSection 
          data={data} 
          paginatedData={paginatedData} 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
        <Separator />
        <MypageFooter />
      </PageLayout>
    </main>
  );
}
