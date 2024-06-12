/* eslint-disable @next/next/no-img-element */
'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwiperCore from 'swiper';
import { heroImages } from '@/data/data';

export default function MainHero() {
  const [swiperState, setSwiperState] = useState({
    bgColor: heroImages[0].bgColor,
    title: heroImages[0].title,
    currentIndex: 1,
    isBeginning: true,
    isEnd: false
  });

  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  const handleSlideChange = (swiper: SwiperCore) => {
    const activeIndex = swiper.activeIndex;

    // 상태를 한 번에 업데이트하여 버튼 활성화/비활성화 제어
    setSwiperState({
      bgColor: heroImages[activeIndex].bgColor,
      title: heroImages[activeIndex].title,
      currentIndex: activeIndex + 1,
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd
    });
  };

  const navBtn = (
    <div className='flex space-x-2 md:space-x-4 absolute left-1/4 bottom-1 md:bottom-4 z-10 items-center'>
      <button
        onClick={() => swiperInstance?.slidePrev()}
        aria-label="Previous slide"
        disabled={swiperState.isBeginning}
        className='bg-slate-800/40 hover:bg-slate-800/60 disabled:hover:bg-slate-800/40 size-6 md:size-10 rounded-full shadow flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <ChevronLeft className='size-4 md:size-5 text-slate-200' strokeWidth={3} />
      </button>
      <span className='text-slate-200 p-2 rounded-md shadow text-sm'>{`${swiperState.currentIndex} / ${heroImages.length}`}</span>
      <button
        onClick={() => swiperInstance?.slideNext()}
        aria-label="Next slide"
        disabled={swiperState.isEnd}
        className='bg-slate-800/40 hover:bg-slate-800/60 disabled:hover:bg-slate-800/40 size-6 md:size-10 rounded-full shadow flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <ChevronRight className='size-4 md:size-5 text-slate-200' strokeWidth={3} />
      </button>
      <p className='text-slate-200 pl-2 flex items-end text-sm md:text-base'>{swiperState.title}</p>
    </div>
  );

  return (
    <section
      style={{ backgroundColor: swiperState.bgColor }}
      className='relative flex justify-center items-center w-full transition-colors'
    >
      <img src={heroImages[swiperState.currentIndex - 1].image} alt={`backgound blur image`} width={1200} height={450}
        className='w-full inset-x-0 h-[450px] absolute blur-[20px] xl:block hidden' />
      <Swiper
        onSwiper={setSwiperInstance}
        keyboard={true}
        watchOverflow={true}
        className='relative max-w-[1200px] w-full h-auto max-h-[450px] object-fill'
        onSlideChange={handleSlideChange}
      >
        {heroImages.map((item, i) => (
          <SwiperSlide key={i}>
            <img
              src={item.image}
              width={1200}
              height={450}
              className='max-h-[450px]'
              alt={`${item.title} hero image`}
              // priority={i === 0 ? true : false}
            />
            {navBtn}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
