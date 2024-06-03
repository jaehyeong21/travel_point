import HeroSection from '@/components/common/hero-section';
import Onboarding from '@/components/section/recommended/onboarding';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '여행지 추천',
  description: '부루마블 게임을 통해 여행지를 추천하는 페이지입니다'
};

export default function RecommendedPage() {

  return (
    <main>
      <HeroSection page='recommended' title='여행지 추천' subtitle='당신만의 완벽한 여행지를 발견하세요' />
      <div className='min-h-dvh mt-20 w-full overflow-hidden'>
        <Onboarding />
      </div>
    </main>
  );
}
