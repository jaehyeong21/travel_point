'use client';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/common/star-rating';
import { Siren, Bookmark } from 'lucide-react';
import { GoCopy } from 'react-icons/go';
import { useToast } from '@/components/ui/use-toast';
import { bookMarkDestination, isBookmarked, deleteBookmarkbyId } from '@/services/fetch-auth';
import { useUserStore } from '@/store/userStore';
import { getRatingsByDestination, getReviewCountByDestination } from '@/services/fetch-review';

interface DestinationHeaderProps {
  title: string;
  contentId?: string;
  location: string;
  tags?: string[];
  destinationId?: string;
  isLoading?: boolean;
}

export default function DestinationHeader({ title, location, tags, contentId, destinationId, isLoading }: DestinationHeaderProps) {
  const user = useUserStore((state) => state.user);
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [numPeople, setNumPeople] = useState<number>(0);
  const { toast } = useToast();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'URL 복사되었습니다',
        description: 'URL이 클립보드에 복사되었습니다.',
      });
    } catch (err) {
      toast({
        title: '복사 실패',
        description: 'URL 복사에 실패했습니다.',
      });
    }
  };

  useEffect(() => {
    const checkBookmark = async () => {
      if (user && destinationId) {
        try {
          const response = await isBookmarked(Number(user.id), Number(destinationId));
          setIsBookmarkedState(response.result);
        } catch (error) {
          console.error('Error checking bookmark status:', error);
        }
      }
    };

    const fetchRatingsAndReviewCount = async () => {
      if (destinationId) {
        try {
          const ratingsResponse = await getRatingsByDestination(Number(destinationId));
          setRating(ratingsResponse.result.averageRating);

          const reviewCountResponse = await getReviewCountByDestination(Number(destinationId));
          setNumPeople(reviewCountResponse.result);
        } catch (error) {
          console.error('Error fetching ratings and review count:', error);
        }
      }
    };

    checkBookmark();
    fetchRatingsAndReviewCount();
  }, [user, destinationId]);

  const handleBookmark = async () => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
      });
      return;
    }

    if (!destinationId) {
      console.log('destinationId 없음');
      return;
    }

    try {
      if (isBookmarkedState) {
        await deleteBookmarkbyId(Number(user.id), Number(destinationId));
        setIsBookmarkedState(false);
        toast({
          title: '북마크 해제되었습니다',
        });
      } else {
        await bookMarkDestination(Number(user.id), Number(destinationId));
        setIsBookmarkedState(true);
        toast({
          title: '북마크 추가되었습니다',
        });
      }
    } catch (err) {
      toast({
        title: '에러 발생',
      });
      console.error(err);
    }
  };

  return (
    <header className='py-8'>
      <Separator className='my-4' />
      <div className='max-w-[900px] mx-auto'>
        <div className='flex justify-between'>
          <div className='flex xsm:gap-2  xsm:flex-row flex-col'>
            <h2 className='sm:text-xl font-bold'>{title}</h2>
            {isLoading ? <StarRating className='xsm:ml-1.5' rating={rating} numPeople={numPeople} isLoading /> :
              <StarRating className='xsm:ml-1.5' rating={rating} numPeople={numPeople} />}
          </div>
          {/* 북마크, url 저장 */}
          <nav className='flex space-x-2 sm:space-x-4'>
            <div className='mini-icon'>
              <Bookmark
                className={`size-3.5 xsm:size-4 cursor-pointer ${isBookmarkedState ? 'text-blue-600/95 fill-current' : 'text-gray-500'}`}
                onClick={handleBookmark}
              />
            </div>
            {/* <div className='mini-icon'><Siren className='size-3.5 xsm:size-4' /></div> */}
            <div className='mini-icon' onClick={handleCopyClick}>
              <GoCopy className='size-3.5 xsm:size-4' />
            </div>
          </nav>
        </div>
        <div className='pt-2'>
          <p className='text-sm'>{location}</p>
        </div>
      </div>
      <Separator className='my-4' />
      <div className='max-w-screen-sm flex justify-center mx-auto'>
        {tags && tags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #{tag}
          </span>
        ))}
      </div>
    </header>
  );
}
