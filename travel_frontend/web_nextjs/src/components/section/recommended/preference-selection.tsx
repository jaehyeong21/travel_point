'use client';

import { getStyles } from "@/components/common/region-selection";
import { Button } from "@/components/ui/button";
import { ThemeType } from "@/types/categoriy-types";

export default function PreferenceSelectionStep({ preference, onPreferenceChange, onNext, onPrevious }: { preference: ThemeType; onPreferenceChange: (preference: ThemeType) => void; onNext: () => void; onPrevious: () => void }) {
  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-center py-8 font-semibold">여행 취향 설정</h2>
        <div className="mb-6">
          <div className="flex gap-4 flex-wrap items-center justify-center phone-container">
            {['전체', '자연', '힐링', '역사', '체험', '엑티비티'].map((pref) => {
              const themePref = pref === '전체' ? 'all' : pref as ThemeType;
              return (
                <button
                  key={pref}
                  className={`text-sm ${getStyles('recommended', preference === themePref)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                  onClick={() => onPreferenceChange(themePref)}
                >
                  {pref}
                </button>
              );
            })}
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