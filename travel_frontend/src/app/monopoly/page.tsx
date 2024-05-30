
import Title from '@/components/common/title';
import { MonopolyContent } from '@/components/section/monopoly/monopoly-contnet';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '부루마블',
  description: '부루마블 게임처럼 주사위를 굴려서 국내여행지를 추천받는 페이지입니다'
};

export default function MonopolyPage() {

  return (
    <main className='w-full overflow-hidden'>
      <section className="min-h-screen bg-blue-100 flex flex-col items-center justify-center relative w-full">
        <Title className="absolute top-12">부루마블! 여행지 추천</Title>
        <MonopolyContent />
      </section>
    </main>
  );
}
