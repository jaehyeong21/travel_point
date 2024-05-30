import { calculateStarRating, cn } from '@/libs/utils';
import { FaRegStar, FaStar, FaRegStarHalfStroke } from "react-icons/fa6";

import React from 'react';

interface StarRatingProps {
  rating: number;
  numPeoPle?: number;
  className?: string;
}

export default function StarRating({ rating, numPeoPle, className }: StarRatingProps) {
  const { fullStars, hasHalfStar, emptyStars } = calculateStarRating(rating);

  return (
    <>
      <div className={cn('flex items-center', className)}>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FaStar key={index} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaRegStarHalfStroke className="text-yellow-500" />}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <FaRegStar key={index} className="text-gray-300" />
        ))}
      </div>
      {numPeoPle && <span className='text-[12px]'>({numPeoPle})</span> }
    </>
  );
}
