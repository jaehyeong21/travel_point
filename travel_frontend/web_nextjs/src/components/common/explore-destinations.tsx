'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Title from '@/components/common/title';
import { Separator } from '@/components/ui/separator';
import DestinationCard from '@/components/common/destination-card';
import DestinationPagination from '@/components/common/destination-pagination';
import { DestinationType, FestivalType } from '@/types/destination-types';
import { themeCategories } from '@/types/destination-fetch-props';
import { pageColors } from '@/data/data';
import { useThemeStore } from '@/store/themeStore';
import { ThemeType } from '@/types/categoriy-types';

interface ExploreDestinationsProps {
  data: DestinationType[] | FestivalType[];
  region?: string;
  page: string;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

function isFestivalType(destination: DestinationType | FestivalType): destination is FestivalType {
  return (destination as FestivalType).startDate !== undefined;
}

// 브라우저 창 크기에 따라 카드 나누는 수를 계산하는 함수
function calculateDivideNumber(width: number): number {
  if (width >= 768) return 5;
  if (width >= 640) return 4;
  if (width >= 450) return 3;
  return 2;
}

export default function ExploreDestinations({
  data,
  region,
  page,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  totalPages,
}: ExploreDestinationsProps) {
  const [divideNumber, setDivideNumber] = useState(5);
  const itemsPerPage = 10;

  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setSelectedTheme = useThemeStore((state) => state.setSelectedTheme);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    // 창 크기 변경 시 divideNumber를 업데이트하는 함수
    const handleResize = () => {
      setDivideNumber(calculateDivideNumber(window.innerWidth));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 테마를 'all'로 설정
    setSelectedTheme('all');
  }, [setSelectedTheme]);

  useEffect(() => {
    // URL에서 현재 페이지를 가져와 설정
    const pageParam = searchParams.get('page');
    if (pageParam) {
      onPageChange(parseInt(pageParam, 10));
    }
  }, [searchParams, onPageChange]);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}#mainSection`;
  };

  // 필터 - 테마 변경함수
  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    const params = new URLSearchParams(searchParams);
    params.set('theme', theme);
    params.set('page', '1'); // 페이지를 1로 설정
    router.push(`${pathname}?${params.toString()}#mainSection`);
  };


  return (
    <section id="mainSection">
      <Title>{region && region !== 'all' ? `${region} 지역의 이런 여행지 어때요?` : '이런 여행지 어때요?'}</Title>
      {page === 'themes' ? (
        <>
          <Separator />
          <div className="flex h-5 items-center space-x-3 xsm:space-x-5 text-xs xsm:text-sm m-3 pl-1 list-none text-nowrap">
            <li
              onClick={() => handleThemeChange('all')}
              className={`cursor-pointer ${selectedTheme === 'all' ? `font-medium ${pageColors.themes.ring} ring rounded-full ring-offset-2 px-1.5` : ''}`}
            >
              전체
            </li>
            {Object.keys(themeCategories).filter((theme) => theme !== 'all').map((theme, index) => (
              <React.Fragment key={index}>
                <Separator orientation="vertical" />
                <li
                  onClick={() => handleThemeChange(theme as ThemeType)}
                  className={`cursor-pointer ${selectedTheme === theme ? `font-medium ${pageColors.themes.ring} ring rounded-full ring-offset-2 px-1.5` : ''}`}
                >
                  {theme}
                </li>
              </React.Fragment>
            ))}
          </div>
          <Separator />
        </>
      ) : page === 'festivals' ? ''
        : page === 'regions' ? (
          <>
            <Separator />
            <div className="flex h-5 items-center space-x-3 xsm:space-x-5 text-xs xsm:text-sm m-3 pl-1 list-none text-nowrap">
              <li>전체</li>
              <Separator orientation="vertical" />
              <li>후기순</li>
            </div>
            <Separator />
          </>
        ) : ''
      }

      <section className="p-3 sm:p-6 grid grid-cols-2 xsm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-5 gap-y-8 pt-7 sm:pt-12">
        {isLoading ?
          [...Array(itemsPerPage)].map((_, i) => (
            <DestinationCard key={i} isLoading />
          )) : isError ?
            [...Array(itemsPerPage)].map((_, i) => (
              <DestinationCard key={i} isError />
            ))
            : data.map((destination, i) => (
              <React.Fragment key={i}>
                <DestinationCard
                  isSmallSize
                  className="col-span-1 first:ml-0"
                  FestivalDate={
                    isFestivalType(destination)
                      ? { startDate: destination.startDate, endDate: destination.endDate }
                      : undefined
                  }
                  contentId={destination.contentId}
                  imageSrc={destination.firstImage}
                  location={destination.location}
                  title={destination.title}
                  description={destination.destinationDescription}
                />
                <Separator
                  className={`${(i + 1) % divideNumber === 0 ? 'block' : 'hidden'}`}
                  style={{ gridColumn: `span ${divideNumber} / span ${divideNumber}` }}
                />
              </React.Fragment>
            ))}
      </section>

      <DestinationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        createPageUrl={createPageUrl}
      />
    </section >
  );
}
