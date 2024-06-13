'use client';
import DestinationCard from "@/components/common/destination-card";
import Title from "@/components/common/title";
import CardLayout from "@/components/layout/card-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRecommendStore } from "@/store/recommendStore";

export default function ResultStep({ onRestart }: { onRestart: () => void }) {
  const movedPositions = useRecommendStore((state) => state.movedPositions);
  const destinationData = movedPositions.map((data) => (
    {
      location: data.location.split(' ').slice(0, 2).join(' '),
      title: data.title,
      firstImage: data.firstImage,
      destinationDescription: data.destinationDescription ? data.destinationDescription.slice(0, 55) : '',
      contentId: data.contentId
    }
  ));

  const { toast } = useToast();
  const saveResults = () => {
    localStorage.setItem('recommendation', JSON.stringify(destinationData));

    try {
      toast({
        title: '저장 성공',
        description: '추천 여행지가 "마이페이지"에 저장되었습니다.',
      });
    } catch (err) {
      toast({
        title: '저장 실패',
        description: '저장에 실패했습니다.',
      });
    }
  };
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
      <div className="flex justify-center gap-4 sm:gap-6 mt-8">
        <Button onClick={onRestart} variant="primary" className="mt-8">
          다시 시작
        </Button>
        <Button onClick={saveResults} variant="primary" className="mt-8">
          추천여행지 저장
        </Button>
      </div>
    </section>
  );
}