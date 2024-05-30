'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DestinationCard from '@/components/common/destination-card';
import { Separator } from '@/components/ui/separator';
import Title from '@/components/common/title';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Keyboard, Pagination } from 'swiper/modules';
import SwiperCore from "swiper";
import { useFetchThemeDestinationByCat } from '@/hooks/use-fetch-destination';
import { themeCategories } from '@/types/destination-fetch-props';

interface ThemeCardProps {
  themeImages: {
    title: string;
    image: string;
  }
  isSecondCard?: boolean;
  theme: keyof typeof themeCategories;
  count: number;
}

export default function ThemeCard({ themeImages, isSecondCard = false, theme, count }: ThemeCardProps) {
  const itemsPerPage = 2; // 한 페이지에 표시할 아이템 수
  const { data, isLoading, isError } = useFetchThemeDestinationByCat({ count: String(count), page: '1', theme });
  const router = useRouter();
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (swiper) {
      const slidesPerView = typeof swiper.params.slidesPerView === 'number' ? swiper.params.slidesPerView : 1;
      setTotalPages(Math.ceil(swiper.slides.length / slidesPerView));
      swiper.on('slideChange', () => {
        setCurrentPage(Math.floor(swiper.realIndex / slidesPerView));
      });
    }
  }, [swiper]);

  const handlePageClick = (index: number) => {
    const slidesPerView = typeof swiper?.params.slidesPerView === 'number' ? swiper.params.slidesPerView : 1;
    swiper?.slideTo(index * slidesPerView);
  };


  return (
    <>
      {isSecondCard && (
        <>
          <Separator className='block md:hidden' />
          <Title className='flex md:hidden'>당신만의 여행 취향 찾기2</Title>
        </>
      )}
      <div className='relative mb-[260px] md:mb-[200px]'>
        <div className='absolute -top-7 right-0 flex items-center'>
          <div className="flex gap-1.5 mr-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className={`size-5 text-sm transition-all font-semibold rounded-full ${currentPage === index ? 'bg-slate-800/95 text-slate-100' : 'text-slate-600'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className='items-center cursor-pointer inline-block'
            onClick={() => router.push(`/themes`)}
          >
            <span className='flex items-center text-sm'>더보기 <ChevronRight className='size-[15px] ml-[3px]' strokeWidth={1} /></span>
          </button>
        </div>
        <Image width={496} height={300} src={themeImages.image} alt={themeImages.title} className='md:h-[280px] w-full max-h-[300px] sm:block hidden overflow-hidden' priority />
        <div className='absolute top-[75%] md:top-[85%] left-0 right-0 mx-auto bg-white w-full sm:w-[90%] p-4'>
          <Swiper
            onSwiper={setSwiper}
            slidesPerView={2}
            slidesPerGroup={2}
            spaceBetween={20}
            loop={false}
            keyboard={true}
            watchOverflow={true}
            modules={[Pagination, Keyboard]}
            breakpoints={{
              640: {
                spaceBetween: 20,
              },
            }}
          >
            {isLoading ? [...Array(count)].map((_, index) => (
              <SwiperSlide key={index}>
                <DestinationCard isLoading />
              </SwiperSlide>
            )) : isError ? (
              [...Array(itemsPerPage)].map((_, index) => (
                <SwiperSlide key={index}>
                  <DestinationCard isError />
                </SwiperSlide>)
              )) : (
              data && data.map((item, index) => (
                <SwiperSlide key={index}>
                  <DestinationCard
                    priority={index === 0 ? true : false}
                    imageSrc={item.firstImage}
                    location={item.location}
                    title={item.title}
                    description={item.destinationDescription}
                    contentId={item.contentId}
                  />
                </SwiperSlide>
              )))}
          </Swiper>
        </div>
      </div>
    </>
  );
}