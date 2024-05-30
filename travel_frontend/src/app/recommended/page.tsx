import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import Onboarding from '@/components/section/recommended/onboarding';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '여행지 추천',
  description: '여행지를 추천받을 수 있는 페이지입니다'
};

export default function RecommendedPage() {

  return (
    <main>
      <HeroSection page='recommended' title='여행지 추천' subtitle='당신만의 완벽한 여행지를 발견하세요' />
      <PageLayout className='mt-20'>
        <Onboarding />
      </PageLayout>
    </main>
  );
}
