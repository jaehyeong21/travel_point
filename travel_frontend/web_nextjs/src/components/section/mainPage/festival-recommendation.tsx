'use client';
import React, { useState } from 'react';
import DestinationCard from '@/components/common/destination-card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Title from '@/components/common/title';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/custom-swiper.css';
import { Pagination, Keyboard } from 'swiper/modules';
import SwiperCore from 'swiper';
import { useFetchFestival } from '@/hooks/use-fetch-destination';

export default function FestivalRecommendation({ count }: { count: string }) {
  const itemsPerPage = 4;
  const { data, isLoading, isError } = useFetchFestival({ count: count, page: '1', sort: '1' });
  const [swiperState, setSwiperState] = useState({
    swiperInstance: null as SwiperCore | null,
    isBeginning: true,
    isEnd: false,
  });

  const handleSwiper = (newSwiper: SwiperCore) => {
    newSwiper.on('slideChange', () => updateNavigationState(newSwiper)); // 슬라이드 변경 시 상태 업데이트
    updateNavigationState(newSwiper); // 초기 상태 업데이트
    setSwiperState({
      ...swiperState,
      swiperInstance: newSwiper,
    });
  };

  const updateNavigationState = (swiperInstance?: SwiperCore) => {
    const swiper = swiperInstance || swiperState.swiperInstance;
    if (swiper) {
      setSwiperState((prevState) => ({
        ...prevState,
        isBeginning: swiper.isBeginning,
        isEnd: swiper.isEnd,
      }));
    }
  };

  const goPrev = () => {
    if (swiperState.swiperInstance && !swiperState.isBeginning) {
      swiperState.swiperInstance.slidePrev();
    }
  };

  const goNext = () => {
    if (swiperState.swiperInstance && !swiperState.isEnd) {
      swiperState.swiperInstance.slideNext();
    }
  };

  const navBtn = (
    <div className='flex gap-x-4 absolute z-10 right-2 md:right-0 top-1'>
      <button
        onClick={goPrev}
        aria-label='Previous slide'
        disabled={swiperState.isBeginning}
        className='disabled:cursor-not-allowed disabled:text-slate-300 hover:text-slate-700/80 disabled:hover:text-slate-300'
      >
        <ChevronLeft />
      </button>
      <button
        onClick={goNext}
        aria-label='Next slide'
        disabled={swiperState.isEnd}
        className='disabled:cursor-not-allowed disabled:text-slate-300 hover:text-slate-700/80 disabled:hover:text-slate-300'
      >
        <ChevronRight />
      </button>
    </div>
  );

  return (
    <section className='px-1'>
      <Title navBtn={navBtn}>이런 축제 어때요?</Title>
      <Swiper
        onSwiper={handleSwiper}
        slidesPerView={4}
        slidesPerGroup={4}
        spaceBetween={30}
        loop={false}
        keyboard={true}
        watchOverflow={true}
        pagination={{
          type: 'bullets',
          clickable: true,
        }}
        modules={[Pagination, Keyboard]}
        breakpoints={{
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 25,
          },
          960: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        }}
      >
        {isLoading
          ?
          <div className={`grid grid-cols-4 gap-x-6`}>
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i}>
                <DestinationCard isLoading />
              </div>
            ))}</div>
          : isError
            ?
            <div className={`grid grid-cols-4 gap-x-6`}>
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i}>
                  <DestinationCard isError />
                </div>
              ))}
            </div>
            : data &&
            data.destinations.map((item, i) => (
              <SwiperSlide key={i}>
                <DestinationCard
                  FestivalDate={{ startDate: item.startDate, endDate: item.endDate }}
                  priority={false}
                  location={item.location}
                  title={item.title}
                  description={item.destinationDescription}
                  imageSrc={item.firstImage}
                  contentId={item.contentId}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
}
