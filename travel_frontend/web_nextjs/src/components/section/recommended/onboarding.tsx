'use client';

import { useState } from 'react';
import StepProgress from '@/components/section/recommended/step-progress';
import StartSection from '@/components/section/recommended/start-section';
import RegionSelection from '@/components/section/recommended/region-selection-step';
import PreferenceSelection from '@/components/section/recommended/preference-selection';
import TravelGameStep from '@/components/section/recommended/travel-game'; // 경로 수정
import { Theme } from '@/store/themeStore';
import ResultStep from '@/components/section/recommended/result-step';


export default function TravelRecommendations() {

  const [state, setState] = useState<{
    step: number;
    theme: Theme;
    areaName: string;
  }>({
    step: 0,
    theme: 'all',
    areaName: 'all',
  });

  const handlePreferenceChange = (newValue: Theme) => {
    setState(prevState => ({
      ...prevState,
      theme: newValue
    }));
  };

  const handleRegionChange = (region: string) => {
    setState(prevState => ({
      ...prevState,
      areaName: region
    }));
  };

  const goToNextStep = () => {
    setState(prevState => ({
      ...prevState,
      step: prevState.step + 1
    }));
  };

  const goToPreviousStep = () => {
    setState(prevState => ({
      ...prevState,
      step: prevState.step - 1
    }));
  };

  const skipToGameStep = () => {
    setState(prevState => ({
      ...prevState,
      step: 3
    }));
  };

  const restart = () => {
    setState({
      step: 0,
      theme: 'all',
      areaName: 'all',
    });
  };

  const renderStep = () => {
    switch (state.step) {
    case 0:
      return <StartSection onNext={goToNextStep} onSkip={skipToGameStep} />;
    case 1:
      return (
        <RegionSelection
          areaName={state.areaName}
          onRegionChange={handleRegionChange}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      );
    case 2:
      return (
        <PreferenceSelection
          preference={state.theme}
          onPreferenceChange={handlePreferenceChange}
          onNext={goToNextStep}
          onPrevious={goToPreviousStep}
        />
      );
    case 3:
      return <TravelGameStep onNext={goToNextStep} onPrevious={goToPreviousStep} theme={state.theme} areaName={state.areaName} />;
    case 4:
      return <ResultStep onRestart={restart} />;
    default:
      return null;
    }
  };

  return (
    <>
      <StepProgress step={state.step + 1} />
      {renderStep()}
    </>
  );
}
