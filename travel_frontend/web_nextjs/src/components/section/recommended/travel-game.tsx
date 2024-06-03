
import { Button } from "@/components/ui/button";
import MonopolyContent from "@/components/section/recommended/monopoly-contnet";
import { Theme } from "@/store/themeStore";

interface TravelGameStepProps {
  onNext: () => void;
  onPrevious: () => void;
  theme: Theme;
  areaName: string;
}

export default function TravelGameStep({ onNext, onPrevious, theme, areaName }: TravelGameStepProps) {  
  return (
    <>
      <h2 className="text-center py-8 font-semibold">여행지 부루마블</h2>      
      <section className="min-h-screen bg-blue-100 flex flex-col items-center justify-center relative w-full">
        <MonopolyContent theme={theme} areaName={areaName}/>
        <div className="absolute bottom-10">
          <div className="flex justify-center gap-4 sm:gap-6 mt-8">
            <Button onClick={onPrevious} variant="secondary">
              이전
            </Button>
            <Button onClick={onNext} variant="primary">
              다음
            </Button>
          </div>
        </div>
      </section>
    </>

  );
}

