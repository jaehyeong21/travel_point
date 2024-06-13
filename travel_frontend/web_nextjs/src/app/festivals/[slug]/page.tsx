
import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import FestivalContent from '@/components/section/festival/festival-content';

import { Metadata } from 'next';

interface FestivalDetailPageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: '축제',
  description: '축제 상세페이지 입니다'
};

export default function FestivalDetailPage({ params }: FestivalDetailPageProps) {

  return (
    <main>
      <HeroSection page='destination' title='축제' subtitle='즐거운 축제' />
      <PageLayout>
        <FestivalContent slug={params.slug} />
      </PageLayout>
    </main>
  );
}
