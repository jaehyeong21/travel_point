import React, { useEffect, useState } from 'react';
import DestinationCard from "@/components/common/destination-card";
import DestinationPagination from "@/components/common/destination-pagination";
import { X } from 'lucide-react';
import Link from 'next/link';
import { HiOutlineArrowRight } from "react-icons/hi2";

interface DestinationType {
  location: string;
  title: string;
  firstImage: string;
  destinationDescription: string;
  contentId: string;
}

const ITEMS_PER_PAGE = 6;

export default function RecommendationTab() {
  const [recommendationData, setrecommendationData] = useState<DestinationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedDestinations = localStorage.getItem('recommendation');
    if (storedDestinations) {
      setrecommendationData(JSON.parse(storedDestinations));
    }
  }, []);

  const totalPages = Math.ceil(recommendationData.length / ITEMS_PER_PAGE);
  const paginatedData = recommendationData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeDestination = (contentId: string) => {
    const updatedDestinations = recommendationData.filter(d => d.contentId !== contentId);
    setrecommendationData(updatedDestinations);
    localStorage.setItem('recommendation', JSON.stringify(updatedDestinations));
  };

  return (
    <>
      {recommendationData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:px-12 py-2">
          {paginatedData.map((item, index) => (
            <div key={index} className="px-4 relative">
              <button
                onClick={() => removeDestination(item.contentId)}
                className="absolute top-0 right-0 text-xs pl-2 text-red-500 hover:text-red-700 transition-colors"
                title="Remove Destination"
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
          <p className="text-gray-600">추천 받은 여행지가 없습니다.</p>
          <Link href="/recommended" className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
            추천 받으러 가기
            <HiOutlineArrowRight className="ml-1.5" />
          </Link>
        </div>
      )
      }
    </>
  );
}

