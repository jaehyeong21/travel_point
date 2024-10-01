'use client';

import StepProgress from '@/components/section/recommended/step-progress';
import StartSection from '@/components/section/recommended/start-section';
import RegionSelection from '@/components/section/recommended/region-selection-step';
import PreferenceSelection from '@/components/section/recommended/preference-selection';
import TravelGameStep from '@/components/section/recommended/travel-game'; 
import ResultStep from '@/components/section/recommended/result-step';
import { useRecommendStore } from '@/store/recommendStore';
import { ThemeType } from '@/types/categoriy-types';

export default function TravelRecommendations() {
  const { step, theme, areaName, setStep, setTheme, setAreaName, resetState } = useRecommendStore();

  const handlePreferenceChange = (newValue: ThemeType) => {
    setTheme(newValue);
  };

  const handleRegionChange = (region: string) => {
    setAreaName(region);
  };

  // 브루마블 height이 더 높아서 0.1초 뒤에 스크롤 내리기
  const goToNextStep = () => {
    setStep(step + 1);
    if (step === 2 || step === 3) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100); 
    }
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const skipToGameStep = () => {
    setStep(3);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100); 
  };

  const restart = () => {
    resetState();
  };

  const renderStep = () => {
    switch (step) {
    case 0:
      return <StartSection onNext={goToNextStep} onSkip={skipToGameStep} />;
    case 1:
      return (
        <RegionSelection
          areaName={areaName}
          onRegionChange={handleRegionChange}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      );
    case 2:
      return (
        <PreferenceSelection
          preference={theme}
          onPreferenceChange={handlePreferenceChange}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      );
    case 3:
      return <TravelGameStep onNext={goToNextStep} onPrevious={goToPreviousStep} theme={theme} areaName={areaName} />;
    case 4:
      return <ResultStep onRestart={restart} />;
    default:
      return null;
    }
  };

  return (
    <>
      <StepProgress step={step + 1} />
      {renderStep()}
    </>
  );
}
