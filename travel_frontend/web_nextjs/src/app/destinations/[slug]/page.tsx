
import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import DestinationContent from '@/components/section/destination/destination-content';
import { Metadata } from 'next';

interface DestinationDetailPageProps {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: '여행지 상세',
  description: '여행지의 상세페이지 입니다'
};

export default function DestinationDetailPage({ params }: DestinationDetailPageProps) {

  return (
    <main>
      <HeroSection page='destination' title='여행지' subtitle='즐거운 여정' />
      <PageLayout>
        <DestinationContent slug={params.slug}/>        
      </PageLayout>
    </main>
  );
}
