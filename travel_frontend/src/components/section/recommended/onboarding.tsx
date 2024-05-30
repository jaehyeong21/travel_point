'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check } from 'lucide-react';
import { useState } from 'react';

import Link from 'next/link';
import RegionSelection, { getStyles } from '@/components/common/region-selection';

function PreferenceRadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
      <label className="text-lg flex font-medium mb-2 sm:mb-0 items-center min-w-[70px] justify-center">{label}</label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex space-x-2 sm:space-x-4"
      >
        {options.map((option) => (
          <div key={option} className="relative">
            <RadioGroupItem
              value={option}
              id={`${label}-${option}`}
              className="hidden"
            />
            <Label
              htmlFor={`${label}-${option}`}
              className="flex flex-col items-center cursor-pointer rounded-full p-2 transition relative"
            >
              <span className={`w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center ${value === option ? 'bg-blue-500/80' : 'bg-white'}`}>
                {value === option && (
                  <span className="absolute text-white text-xl"><Check strokeWidth={3} className='size-5' /></span>
                )}
              </span>
              <span className="mt-1 text-xs sm:text-sm">{option}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function StepProgress({ step }: { step: number }) {
  const steps = ['시작하기', '지역 선택', '취향 설정', '추가 설문', '결과 확인'];
  return (
    <div className="mb-8">
      <h2 className="sr-only">단계</h2>
      <ol className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-medium text-gray-500">
        {steps.map((title, index) => (
          <li key={title} className="flex items-center gap-2">
            {index < step ? (
              <span className="rounded bg-green-50 p-1.5 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : (
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${index === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                } text-center text-xs font-bold`}
              >
                {index + 1}
              </span>
            )}
            <span className={`${index === step ? 'text-blue-600' : 'text-gray-600'} text-xs sm:text-sm`}>{title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TravelRecommendations() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    nature: '보통',
    relaxation: '보통',
    history: '보통',
    experience: '보통',
    activity: '보통',
  });
  const [survey, setSurvey] = useState({
    age: '20대',
    travelCompanion: '혼자',
    travelDuration: '당일치기',
  });
  const [activeRegion, setActiveRegion] = useState('');

  const handleRadioGroupChange = (type: string, newValue: string) => {
    setPreferences((prev) => ({ ...prev, [type]: newValue }));
  };

  const handleSurveyChange = (key: string, value: string) => {
    setSurvey((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
  };

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const skipToFinalStep = () => {
    setStep(4);
  };

  const toBeginningStep = () => {
    setStep(0);
  };

  const renderResult = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">설문 결과</h2>
        <ul className="space-y-2">
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">나이:</span>
            <span>{survey.age}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">여행 동반자:</span>
            <span>{survey.travelCompanion}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">여행 기간:</span>
            <span>{survey.travelDuration}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선호하는 자연:</span>
            <span>{preferences.nature}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선호하는 휴양:</span>
            <span>{preferences.relaxation}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선호하는 역사:</span>
            <span>{preferences.history}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선호하는 체험:</span>
            <span>{preferences.experience}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선호하는 액티비티:</span>
            <span>{preferences.activity}</span>
          </li>
          <li className="flex justify-between bg-gray-100 p-4 rounded-lg">
            <span className="font-medium">선택한 지역:</span>
            <span>{activeRegion}</span>
          </li>
        </ul>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
    case 0:
      return (
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-8">여행 추천에 오신 것을 환영합니다!</h1>
          <p className="text-base sm:text-lg mb-6">맞춤 여행지를 찾아보세요.</p>
          <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
            <Button onClick={goToNextStep} variant="primary">
                설문조사 시작하기
            </Button>
            <Button onClick={skipToFinalStep} variant="secondary">
                무작위 여행지 추천
            </Button>
            <Button variant="secondary">
              <Link href='/monopoly'>여행지 추천 게임 한판!</Link>
            </Button>
          </div>
        </div>
      );
    case 1:
      return (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">지역 선택</h1>
          <RegionSelection
            page="recommended"
            title="여행지 지역 선택"
            activeRegion={activeRegion}
            onRegionChange={handleRegionChange}
          />
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={goToPreviousStep} variant="secondary">
                이전
            </Button>
            <Button onClick={goToNextStep} variant="primary">
                다음
            </Button>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">취향 설정</h1>
          <div className="flex flex-col">
            <PreferenceRadioGroup
              label="자연"
              options={['해당 없음', '약간 선호', '보통', '선호', '매우 선호']}
              value={preferences.nature}
              onChange={(value) => handleRadioGroupChange('nature', value)}
            />
            <PreferenceRadioGroup
              label="휴양"
              options={['해당 없음', '약간 선호', '보통', '선호', '매우 선호']}
              value={preferences.relaxation}
              onChange={(value) => handleRadioGroupChange('relaxation', value)}
            />
            <PreferenceRadioGroup
              label="역사"
              options={['해당 없음', '약간 선호', '보통', '선호', '매우 선호']}
              value={preferences.history}
              onChange={(value) => handleRadioGroupChange('history', value)}
            />
            <PreferenceRadioGroup
              label="체험"
              options={['해당 없음', '약간 선호', '보통', '선호', '매우 선호']}
              value={preferences.experience}
              onChange={(value) => handleRadioGroupChange('experience', value)}
            />
            <PreferenceRadioGroup
              label="액티비티"
              options={['해당 없음', '약간 선호', '보통', '선호', '매우 선호']}
              value={preferences.activity}
              onChange={(value) => handleRadioGroupChange('activity', value)}
            />
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={goToPreviousStep} variant="secondary">
                  이전
              </Button>
              <Button onClick={goToNextStep} variant="primary">
                  다음
              </Button>
            </div>
          </div>
        </>
      );
    case 3:
      return (
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">추가 설문</h1>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">나이대</label>
            <div className="flex gap-4 flex-wrap">
              {['20대', '30대', '40대', '50대', '60대 이상'].map((age) => (
                <button
                  key={age}
                  className={`text-sm ${getStyles('recommended', survey.age === age)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                  onClick={() => handleSurveyChange('age', age)}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">함께 가는 사람</label>
            <div className="flex gap-4 flex-wrap">
              {['혼자', '친구', '연인', '가족', '아이', '반려동물'].map((companion) => (
                <button
                  key={companion}
                  className={`text-sm ${getStyles('recommended', survey.travelCompanion === companion)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                  onClick={() => handleSurveyChange('travelCompanion', companion)}
                >
                  {companion}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">여행 기간</label>
            <div className="flex gap-4 flex-wrap">
              {['당일치기', '1박 2일', '2박 3일', '3박 4일 이상'].map((duration) => (
                <button
                  key={duration}
                  className={`text-sm ${getStyles('recommended', survey.travelDuration === duration)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                  onClick={() => handleSurveyChange('travelDuration', duration)}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={goToPreviousStep} variant="secondary">
                이전
            </Button>
            <Button onClick={goToNextStep} variant="primary">
                다음
            </Button>
          </div>
        </div>
      );
    default:
      return (
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">여행 추천 결과</h1>
          <p className="text-base sm:text-lg mb-4">여기에서 추천된 여행지를 확인하세요!</p>
          {renderResult()}
          <Button onClick={toBeginningStep} variant="primary" className="mt-8">
              다시 시작
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <StepProgress step={step} />
      {renderStep()}
    </div>
  );
}
