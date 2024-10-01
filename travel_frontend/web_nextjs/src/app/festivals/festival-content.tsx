'use client';

import ExploreDestinations from "@/components/common/explore-destinations";
import RegionSelection from "@/components/common/region-selection";
import PageLayout from "@/components/layout/page-layout";
import { Separator } from "@/components/ui/separator";
import { REGIONS } from "@/data/data";
import { useFetchFestival } from "@/hooks/use-fetch-destination";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function FestivalsContent() {
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

  const { data, isLoading, isError } = useFetchFestival({ areaName: regionPath, count: '10', page: currentPage.toString(), sort:'1' });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <PageLayout>
        <RegionSelection title='축제 지역 탐색' page='festivals' activeRegion={activeRegion}/>
        <Separator className='my-10 sm:my-14' />
        <ExploreDestinations 
          data={data?.destinations || []}
          region={region}
          page='festivals'
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={Number(data?.totalPages)}
        />
      </PageLayout>
    </>
  );
}