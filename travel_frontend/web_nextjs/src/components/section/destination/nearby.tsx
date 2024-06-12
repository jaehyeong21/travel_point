import React from 'react';
import DestinationCard from '@/components/common/destination-card';
import CardLayout from '@/components/layout/card-layout';
import Title from '@/components/common/title';
import { cn } from '@/libs/utils';
import { useFetchNearby } from '@/hooks/use-fetch-destination';
import { MapProps } from '@/components/common/map';

interface NearbyProps extends MapProps {
  contentId: string;
  count: string;
  areaCode?: string
}

export default function Nearby({ latitude, longitude, count, areaCode, contentId, className }: NearbyProps) {
  const { data, isError, isLoading } = useFetchNearby(
    { latitude: String(longitude), longitude: String(latitude), areaCode: areaCode, count: count, contentId: contentId });

  return (
    <section className={cn('py-10 sm:py-16', className)}>
      <Title className='border-b'>주변 여행지</Title>
      <CardLayout className='gap-6'>
        {data && data.map((item, i) => (
          <DestinationCard key={i} contentId={item.contentId} imageSrc={item.firstImage} location={item.location} title={item.title} description={item.destinationDescription} />
        ))}
      </CardLayout>
    </section>
  );
}
