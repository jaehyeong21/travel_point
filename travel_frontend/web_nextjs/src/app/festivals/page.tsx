
import HeroSection from '@/components/common/hero-section';
import { Metadata } from 'next/types';
import { FestivalsContent } from './festival-content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '축제',
  description: '국내 지역별 축제 추천 페이지입니다'
};

export default function FestivalsPage() {
  return (
    <main>
      <HeroSection page='festivals' title='매혹적인 축제의 세계' subtitle='지금 시작되는 축제의 향연' />
      <Suspense>
        <FestivalsContent />
      </Suspense>
    </main>
  );
}
