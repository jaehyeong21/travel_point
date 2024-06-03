import React from 'react';
import DestinationCard from '@/components/common/destination-card';
import CardLayout from '@/components/layout/card-layout';
import Title from '@/components/common/title';
import { cn } from '@/libs/utils';

interface NearbyProps {
  className?: string
}

export default function Nearby({ className }: NearbyProps) {
  return (
    <section className={cn('py-10 sm:py-16', className)}>
      <Title className='border-b'>주변 여행지</Title>
      <CardLayout className='gap-6'>
        {[...Array(4)].map((item, i) => (
          <DestinationCard key={i} location='강원특별자치도 춘천시' title='대관령 삼양목장' description='정답게 이야기를 나눌 수 있는정답게 이야기를 나눌 수 있는정답게 이야기를 나눌 수 있는정답게 이야기를 나눌 수 있는정답게 이야기를 나눌 수 있는' />
        ))}
      </CardLayout>
    </section>
  );
}
