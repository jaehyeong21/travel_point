'use client';

import { getStyles } from "@/components/common/region-selection";
import { Button } from "@/components/ui/button";
import { Theme } from "@/store/themeStore";

export default function PreferenceSelectionStep({ preference, onPreferenceChange, onNext, onPrevious }: { preference: Theme; onPreferenceChange: (preference: Theme) => void; onNext: () => void; onPrevious: () => void }) {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-center py-8 font-semibold">여행 취향 설정</h2>
        <div className="mb-6">
          <div className="flex gap-4 flex-wrap items-center justify-center phone-container">
            {['전체', '자연', '힐링', '역사', '체험', '엑티비티'].map((pref) => (
              <button
                key={pref}
                className={`text-sm ${getStyles('recommended', preference === pref)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                onClick={() => onPreferenceChange(pref as Theme)}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 sm:gap-6 mt-8">
          <Button onClick={onPrevious} variant="secondary">
            이전
          </Button>
          <Button onClick={onNext} variant="primary">
            다음
          </Button>
        </div>
      </div>
    </>
  );
}