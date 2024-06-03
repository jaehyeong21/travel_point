'use client';
import RegionSelection from "@/components/common/region-selection";
import { Button } from "@/components/ui/button";

export default function RegionSelectionStep({ areaName, onRegionChange, onNext, onPrevious }: { areaName: string; onRegionChange: (region: string) => void; onNext: () => void; onPrevious: () => void }) {
  return (
    <>
      <RegionSelection
        page="recommended"
        title="여행지 지역 선택"
        activeRegion={areaName}
        onRegionChange={onRegionChange}
      />
      <div className="flex justify-center gap-4 sm:gap-6 mt-8">
        <Button onClick={onPrevious} variant="secondary">
          이전
        </Button>
        <Button onClick={onNext} variant="primary">
          다음
        </Button>
      </div>
    </>
  );
}