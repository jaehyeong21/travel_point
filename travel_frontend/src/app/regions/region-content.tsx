'use client';

import ExploreDestinations from "@/components/common/explore-destinations";
import RegionSelection from "@/components/common/region-selection";
import PageLayout from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import { REGIONS } from "@/data/data";
import { useFetchDestination } from "@/hooks/use-fetch-destination";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function RegionsContent() {
  const searchparams = useSearchParams();
  const [activeRegion, setActiveRegion] = useState('all');
  const region = searchparams.get('region') ?? 'all';
  const regionPath = region === 'all' ? '' : REGIONS.find((r) => r.name === region)?.path || '';
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (region) {
      setActiveRegion(region);
    }
  }, [region, activeRegion]);

  const { data, isLoading, isError } = useFetchDestination({ areaName: regionPath, count: '10', page: currentPage.toString() });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <RegionSelection page='regions' title='여행지 지역 탐색' activeRegion={activeRegion} />
      <Separator className='my-10 sm:my-20' />
      <PageLayout>
        <ExploreDestinations
          data={data || []}
          region={region}
          page='regions'
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