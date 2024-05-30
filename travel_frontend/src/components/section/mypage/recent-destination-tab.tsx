import React, { useEffect, useState } from 'react';
import DestinationCard from "@/components/common/destination-card";
import DestinationPagination from "@/components/common/destination-pagination";
import { X } from 'lucide-react';

interface DestinationType {
  location: string;
  title: string;
  firstImage: string;
  destinationDescription: string;
  contentId: string;
}

const ITEMS_PER_PAGE = 6;

export default function RecentDestinationsTab() {
  const [recentDestinations, setRecentDestinations] = useState<DestinationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const storedDestinations = localStorage.getItem('recentDestinations');
    if (storedDestinations) {
      setRecentDestinations(JSON.parse(storedDestinations));
    }
  }, []);

  const totalPages = Math.ceil(recentDestinations.length / ITEMS_PER_PAGE);
  const paginatedData = recentDestinations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeDestination = (contentId: string) => {
    const updatedDestinations = recentDestinations.filter(d => d.contentId !== contentId);
    setRecentDestinations(updatedDestinations);
    localStorage.setItem('recentDestinations', JSON.stringify(updatedDestinations));
  };

  return (
    <div className="min-h-dvh p-4">
      {recentDestinations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 md:px-12 py-2">
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
        <div>최근 본 여행지가 없습니다.</div>
      )}
    </div>
  );
}
