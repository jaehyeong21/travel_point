import { pageColors } from '@/data/data';
import React from 'react';

interface HeroSectionProps {
  page: 'regions' | 'themes' | 'festivals' | 'recommended' | 'mypage' | 'destination' ;
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle, page }: HeroSectionProps) {
  return (
    <section className={`h-28 w-full ${pageColors[page].bg}`}>
      < div className="mx-auto max-w-[1050px] px-4 sm:px-6 lg:px-8 flex items-center h-full">
        <div className="flex items-end justify-start gap-3">
          <h2 className='font-bold text-base lg:text-xl text-nowrap'>{title}</h2>
          <p className='text-xs lg:text-sm text-nowrap'>{subtitle}</p>
        </div>
      </div>
    </section >
  );
}
