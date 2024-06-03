'use client';

import ExploreDestinations from "@/components/common/explore-destinations";
import RegionSelection from "@/components/common/region-selection";
import PageLayout from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import { REGIONS } from "@/data/data";
import { useFetchThemeDestinationByCat } from "@/hooks/use-fetch-destination";
import { useThemeStore } from "@/store/themeStore";
import { themeCategories } from "@/types/destination-fetch-props";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ThemesContent() {
  const searchparams = useSearchParams();
  const [activeRegion, setActiveRegion] = useState<keyof typeof themeCategories>('all');
  const region = searchparams.get('region') ?? 'all';
  const regionPath = REGIONS.find((r) => r.name === region)?.path || '';

  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useFetchThemeDestinationByCat({ areaName: regionPath, count: '10', page: currentPage.toString(), theme: selectedTheme });

  useEffect(() => {
    if (region) {
      setActiveRegion(region as keyof typeof themeCategories);
    }
  }, [region, activeRegion]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <RegionSelection title='테마 여행 지역 탐색' page='themes' activeRegion={activeRegion} />
      <Separator className='my-10 sm:my-20' />
      <PageLayout>
        <ExploreDestinations
          data={data || []}
          region={region}
          page='themes'
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={10}
        />
      </PageLayout>
    </>

  );
}