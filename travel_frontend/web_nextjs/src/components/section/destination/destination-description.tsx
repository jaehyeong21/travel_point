import React from 'react';
import Title from '@/components/common/title';
import { cn, formatFestivalIntro } from '@/libs/utils';

interface DestinationDescriptionProps {
  description: string;
  festivalIntro?: string;
  className?: string
}

export default function DestinationDescription({ description, festivalIntro, className }: DestinationDescriptionProps) {
  if (!description) return;
  return (

    <div className={cn('', className)}>
      <Title className='justify-start mt-8'>{festivalIntro ? '소개' : '상세 정보'}</Title>
      <p className=''>{description}</p>
      {festivalIntro && <>        
        <p dangerouslySetInnerHTML={{ __html: formatFestivalIntro(festivalIntro) }} />
      </>
      }
    </div>
  );
}
