
import HeroSection from '@/components/common/hero-section';
import { Metadata } from 'next';
import { RegionsContent } from './region-content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '지역 여행지',
  description: '지역별로 여행지를 추천받을 수 있는 페이지입니다'
};

export default function RegionsPage() {
  return (
    <main className=''>
      <HeroSection page='regions' title='매력적인 지역 여행지' subtitle='여러분을 기다리는 특별한 장소들' />
      <Suspense>
        <RegionsContent />
      </Suspense>
    </main>
  );
}
