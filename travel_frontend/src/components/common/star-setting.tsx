import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa6';

interface StarSettingProps {
  defaultRating?: number;
  onRatingChange?: (rating: number) => void;
}

const StarSetting: React.FC<StarSettingProps> = ({ defaultRating = 5, onRatingChange }) => {
  const [rating, setRating] = useState<number>(defaultRating);

  const handleStarClick = (index: number) => {
    setRating(index);
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className='flex items-center'>
      <span className='text-sm'>여행지 만족도</span>
      <div className='flex ml-2 items-center gap-x-0.5'>
        <span className='text-sm pr-0.5'>(</span>
        {[...Array(5)].map((_, index) => {
          const starIndex = index + 1;
          return (
            <span key={index} onClick={() => handleStarClick(starIndex)} className='cursor-pointer'>
              {starIndex <= rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-300" />}
            </span>
          );
        })}
        <span className='text-sm pl-0.5'>)</span>
      </div>
    </div>
  );
};

export default StarSetting;
