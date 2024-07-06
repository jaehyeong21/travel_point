/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa6';

interface ReviewCardProps {
  imageSrc: string;
  location: string;
  title: string;
  description: string;
  rate: number;
  likeCount: number;
  createDate: string;
  contentId: string;
}

export default function ReviewCard({ imageSrc, location, title, description, rate, likeCount, createDate, contentId }: ReviewCardProps) {
  return (
    <Link href={`/destinations/${contentId}`}>
      <div className="border rounded-lg p-4 bg-white shadow-md h-full flex flex-col">
        <div className="mt-2 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold">
            {title.length > 15 ? `${title.slice(0, 15)} ...` : title}
          </h3>
          <p className="text-sm text-gray-500">{location.split(' ').slice(0, 2).join(' ')}</p>
          <p className="text-sm text-gray-500">{new Date(createDate).toLocaleDateString()}</p>
          <p className="mt-2 text-sm two-line-truncate overflow-hidden flex-grow">{description}</p>
          <img width={260} height={200} src={imageSrc} alt='댓글 이미지' className='max-h-[200px] w-full object-cover' />
          <div className="mt-2 flex items-center text-xs">
            <div className='flex items-center'>
              {[...Array(5)].map((_, index) => (
                index < rate
                  ? <FaStar key={index} className="text-yellow-500" />
                  : <FaRegStar key={index} className="text-gray-300" />
              ))}
            </div>
            <span className="ml-4 text-gray-500">좋아요 {likeCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
