import React, { useEffect, useState } from 'react';
import DestinationCard from "@/components/common/destination-card";
import DestinationPagination from "@/components/common/destination-pagination";
import { X } from 'lucide-react';
import Link from 'next/link';
import { HiOutlineArrowRight } from "react-icons/hi2";
import { checkBookmarkbyId, deleteBookmarkAll, deleteBookmarkbyId } from '@/services/fetch-auth';
import { useUserStore } from '@/store/userStore';
import { DestinationType } from '@/types/destination-types';

const ITEMS_PER_PAGE = 6;

export default function MyFavoritesTab() {
  const [favoritesData, setFavoritesData] = useState<DestinationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const response = await checkBookmarkbyId(Number(user.id), 0);
        const favorites = response.result.map((item: any) => ({
          location: item.destinationLocation,
          title: item.destinationTitle,
          firstImage: item.destinationFirstImage,
          destinationDescription: item.destinationDescription.slice(0, 55),
          contentId: item.contentId,
          destinationId: item.destinationId
        }));
        setFavoritesData(favorites);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) return null;

  const totalPages = Math.ceil((favoritesData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = (favoritesData || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeFavorite = async (destinationId: string) => {
    await deleteBookmarkbyId(Number(user.id), parseInt(destinationId));
    const updatedFavorites = favoritesData.filter(d => d.destinationId !== destinationId);
    setFavoritesData(updatedFavorites);
  };

  const removeAllFavorites = async () => {
    await deleteBookmarkAll(Number(user.id));
    setFavoritesData([]);
  };

  return (
    <>
      {favoritesData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:px-12 py-2">
          <div className='flex justify-center col-span-2 md:col-span-3 pb-4'>
            <button
              onClick={removeAllFavorites}
              className="px-4 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 text-xs sm:text-sm"
            >
              찜한 여행지 전체 삭제
            </button>
          </div>
          {paginatedData.map((item, index) => (
            <div key={index} className="px-4 relative">

              <button
                onClick={() => removeFavorite(item.destinationId!)}
                className="absolute top-0 right-0 text-xs pl-2 text-red-500 hover:text-red-700 transition-colors"
                title="Remove Favorite"
              >
                <X className="size-3.5" />
              </button>
              <DestinationCard
                imageSrc={item.firstImage}
                location={item.location}
                title={item.title}
                description={item.destinationDescription}
                contentId={item.contentId}
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
          <p className="text-gray-600">내가 찜한 여행지가 없습니다.</p>
          <Link href="/themes" className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
            여행지 둘러보러 가기
            <HiOutlineArrowRight className="ml-1.5" />
          </Link>
        </div>
      )}
    </>
  );
}
