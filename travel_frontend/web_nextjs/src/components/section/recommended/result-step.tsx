'use client';
import DestinationCard from "@/components/common/destination-card";
import Title from "@/components/common/title";
import CardLayout from "@/components/layout/card-layout";
import { Button } from "@/components/ui/button";
import { useRecommendStore } from "@/store/recommendStore";

export default function ResultStep({ onRestart }: { onRestart: () => void }) {
  const movedPositions = useRecommendStore((state) => state.movedPositions);
  console.log(movedPositions);
  return (
    <section className='py-10 sm:py-16 container max-w-[800px] mx-auto'>
      <Title className='border-b'>추천 여행지</Title>
      <CardLayout className='gap-6'>
        {movedPositions.length > 0 ? movedPositions.map((item, i) => (
          <DestinationCard
            key={i}
            contentId={item.contentId}
            location={item.location}
            title={item.title}
            description={item.destinationDescription}
            imageSrc={item.firstImage}
          />
        )) :
          <div className=" text-nowrap col-span-4 text-center text-sm text-red-500/90 space-y-2">
            <p>결과값이 없습니다</p>
            <p>여행지 부르마블에서 주사위를 굴려주세요.</p>
          </div>
        }
      </CardLayout>
      <div className='flex justify-center'>
        <Button onClick={onRestart} variant="primary" className="mt-8">
          다시 시작
        </Button>
      </div>
    </section>
  );
}