import React from 'react';
import Title from '@/components/common/title';
import { cn } from '@/libs/utils';

interface DestinationDescriptionProps {
  description: string;
  className?: string
}

export default function DestinationDescription({ description, className }: DestinationDescriptionProps) {
  return (
    <div className={cn('', className)}>
      <Title className='justify-start mt-8'>상세 정보</Title>
      <p className=''>{description}</p>
    </div>
  );
}
