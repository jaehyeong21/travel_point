
import React from 'react';
import Title from '@/components/common/title';
import ThemeCard from '@/components/common/theme-card';
import { themeImages } from '@/data/data';

export default function ThemeRecommendation() {
  return (
    <section className='relative'>
      <Title className='pb-6'>특별한 테마 여행 찾기</Title>
      <div className='grid md:grid-cols-2 gap-8 grid-cols-1'>
        {/* 테마 카드 */}
        <ThemeCard themeImages={themeImages[0]} theme='역사' count={8}/>
        <ThemeCard themeImages={themeImages[1]} isSecondCard theme='힐링' count={8}/>
      </div>
      {/* 경계선 */}
      <div className='hidden absolute md:block top-16 bottom-0 left-1/2 transform -translate-x-1/2 w-[0.5px] bg-gray-300'></div>
    </section >
  );
}