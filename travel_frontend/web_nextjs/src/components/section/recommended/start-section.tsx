'use client';
import { Button } from "@/components/ui/button";

export default function StartSection({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="text-center">
      <h1 className="text-xl sm:text-2xl font-semibold mb-8">여행 추천에 오신 것을 환영합니다!</h1>
      <p className="text-base sm:text-lg mb-6">맞춤 여행지를 추천받아보세요.</p>
      <div className="flex items-center justify-center gap-4 sm:gap-6 flex-col sm:flex-row">
        <Button onClick={onNext} variant="primary">
          설문조사 시작하기
        </Button>
        <Button onClick={onSkip} variant="secondary">
          무작위 여행지 추천
        </Button>
      </div>
    </div>
  );
}