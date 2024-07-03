import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { HiOutlineArrowRight } from "react-icons/hi2";
import { getMyReviews, deleteReview } from '@/services/fetch-review';
import { useUserStore } from '@/store/userStore';
import DestinationPagination from '@/components/common/destination-pagination';
import ReviewCard from '@/components/common/review-card';
import { MyReviewType } from '@/types/comment-type';

const ITEMS_PER_PAGE = 6;



export default function ReviewTab() {
  const [reviewData, setReviewData] = useState<MyReviewType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchReviews = async () => {
      if (user) {
        const response = await getMyReviews(Number(user.id));
        setReviewData(response.result);
      }
    };

    fetchReviews();
  }, [user]);

  if (!user) return null;

  const totalPages = Math.ceil((reviewData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = (reviewData || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeReview = async (reviewId: number) => {
    await deleteReview(reviewId);
    const updatedReviews = reviewData.filter(review => review.id !== reviewId);
    setReviewData(updatedReviews);
  };

  return (
    <>
      {reviewData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:px-12 py-2">
          {paginatedData.map((review, index) => (
            <div key={index} className="px-4 relative">
              <button
                onClick={() => removeReview(review.id)}
                className="absolute top-0 right-0 text-xs pl-2 text-red-500 hover:text-red-700 transition-colors"
                title="Remove Review"
              >
                <X className="size-3.5" />
              </button>
              <ReviewCard
                imageSrc={review.imageUrl}
                location={review.destination.location}
                title={review.destination.title}
                description={review.content}
                rate={review.rate}
                likeCount={review.likeCount}
                createDate={review.createDate}
                contentId={review.destination.contentId}
              />
            </div>
          ))}
          <div className='flex justify-center pb-8 mt-5 col-span-2 md:col-span-3'>
            <DestinationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center space-y-4 text-sm">
          <p className="text-gray-600">내가 작성한 리뷰가 없습니다.</p>
          <Link href="/themes" className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
            리뷰 작성하러 가기
            <HiOutlineArrowRight className="ml-1.5" />
          </Link>
        </div>
      )}
    </>
  );
}
