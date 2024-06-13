
import HeroSection from '@/components/common/hero-section';
import { Metadata } from 'next/types';
import { ThemesContent } from './themes-content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '테마여행',
  description: '테마별로 여행지를 추천해주는 페이지입니다'
};

export default function ThemesPage() {
  return (
    <main>
      <HeroSection page='themes' title='테마로 떠나는 여행' subtitle='개성 넘치는 테마 여행과 함께하세요' />
      <Suspense>
        <ThemesContent />
      </Suspense>
    </main>
  );
}
