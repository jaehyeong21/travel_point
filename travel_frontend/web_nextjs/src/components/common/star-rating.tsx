import { calculateStarRating, cn } from '@/libs/utils';
import { FaRegStar, FaStar, FaRegStarHalfStroke } from "react-icons/fa6";

import React from 'react';

interface StarRatingProps {
  rating: number;
  numPeople?: number;
  className?: string;
  isLoading?: boolean;
}

export default function StarRating({ rating, numPeople, className, isLoading }: StarRatingProps) {
  const { fullStars, hasHalfStar, emptyStars } = calculateStarRating(rating);

  return (
    <div className={cn('flex items-center', className)}>
      <div className='flex items-center'>
        {isLoading ?
          [...Array(5)].map((_, index) => <FaStar key={index} className="text-yellow-500" />)
          :
          <>
            {Array.from({ length: fullStars }).map((_, index) => (
              <FaStar key={index} className="text-yellow-500" />
            ))}
            {hasHalfStar && <FaRegStarHalfStroke className="text-yellow-500" />}
            {Array.from({ length: emptyStars }).map((_, index) => (
              <FaRegStar key={index} className="text-gray-300" />
            ))}
          </>
        }
      </div>
      {isLoading ? <span className='text-[12px]'>(0)</span> :
        Number(numPeople) > 0 && <span className='text-[12px]'>({numPeople})</span>}
    </div>
  );
}
