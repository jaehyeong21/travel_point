'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useFetchDestination } from '@/hooks/use-fetch-destination';
import DestinationCard from '@/components/common/destination-card';
import CardLayout from '@/components/layout/card-layout';
import { REGIONS } from '@/data/data';
import { DestinationType } from '@/types/destination-types';

interface RegionArticleProps {
  region: string;
  count: string;
}


export default function RegionArticle({ region, count }: RegionArticleProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2; // 한 페이지에 표시할 아이템 수

  const regionPath = REGIONS.find((r) => r.name === region)?.path || '';
  // 데이터 fetch 훅을 호출합니다.
  const { data, isLoading, isError } = useFetchDestination({ areaName: regionPath, count: count });

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (data && currentPage < Math.ceil(data.destinations.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0); // 마지막 페이지에서는 다시 처음으로
    }
  };

  return (
    <article className='flex flex-col col-span-1 py-2 sm:border-none border-b sm:pb-0 pb-8'>
      <header className='flex flex-col'>
        <h2 className='font-bold pb-1 text-lg sm:text-xl'>{region} 여행지 추천</h2>
        <nav className='justify-end flex pb-2'>
          <button className='items-center cursor-pointer inline-block'
            onClick={() => { router.push(`/regions?region=${region}`); }}>
            <span className='flex items-center text-sm'>더보기 <ChevronRight className='size-[15px] ml-[3px]' strokeWidth={1} /></span>
          </button>
        </nav>
      </header>
      <CardLayout className='gap-6' isTwo>
        {isLoading ? (
          [...Array(itemsPerPage)].map((_, i) => (
            <DestinationCard key={i} isLoading />
          ))
        ) : isError ? (
          [...Array(itemsPerPage)].map((_, i) => (
            <DestinationCard key={i} isError />
          ))
        ) : (
          data && data.destinations.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((item: DestinationType, i: number) => (
            <DestinationCard key={i}
              priority={i === 0 ? true : false}
              contentId={item.contentId} imageSrc={item.firstImage} location={item.location} title={item.title} description={item.destinationDescription} />
          ))
        )}
      </CardLayout>
      {!isLoading && !isError && data && data.destinations.length > 0 && (
        <nav className='flex justify-center pt-10'>
          <button onClick={handleNextPage}>
            <span className='flex justify-center text-sm border px-8 py-2 rounded-sm'>
              다른 여행지 추천 {currentPage + 1} <span className='text-slate-500 pl-1'>/ {Math.ceil(data.destinations.length / itemsPerPage)}</span>
            </span>
          </button>
        </nav>
      )}
    </article>
  );
}
