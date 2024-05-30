'use client';

import RegionSelection from "@/components/common/region-selection";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function FestivalsContent() {
  const searchparams = useSearchParams();
  const [activeRegion, setActiveRegion] = useState('all');
  const region = searchparams.get('region');

  useEffect(() => {
    if (region) {
      setActiveRegion(region as string);
    }
  }, [region, activeRegion]);
  return (
    <>
      <RegionSelection title='축제 지역 탐색' page='festivals' activeRegion={activeRegion}/>
      <Separator className='my-10 sm:my-20' />
      {/* <PageLayout>
        <ExploreDestinations />
      </PageLayout> */}
    </>
  );
}