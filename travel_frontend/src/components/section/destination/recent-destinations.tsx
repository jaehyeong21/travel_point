import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'next-view-transitions';

interface DestinationType {
  location: string;
  title: string;
  firstImage: string;
  destinationDescription: string;
  contentId: string;
}

interface RecentDestinationsProps {
  newDestination: DestinationType;
}

const ITEMS_PER_PAGE = 6;

export default function RecentDestinations({ newDestination }: RecentDestinationsProps) {
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const storedDestinations = localStorage.getItem('recentDestinations');
    if (storedDestinations) {
      setDestinations(JSON.parse(storedDestinations));
    }
  }, []);

  useEffect(() => {
    if (newDestination) {
      setDestinations(prevDestinations => {
        const isDuplicate = prevDestinations.some(d => d.contentId === newDestination.contentId);
        if (!isDuplicate) {
          const updatedDestinations = [newDestination, ...prevDestinations];
          localStorage.setItem('recentDestinations', JSON.stringify(updatedDestinations));
          return updatedDestinations;
        }
        return prevDestinations;
      });
    }
  }, [newDestination]);

  const removeDestination = (contentId: string) => {
    const updatedDestinations = destinations.filter(d => d.contentId !== contentId);
    setDestinations(updatedDestinations);
    localStorage.setItem('recentDestinations', JSON.stringify(updatedDestinations));
  };

  const totalPages = Math.ceil(destinations.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedDestinations = destinations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <aside className="sticky w-full min-w-[240px] max-w-[260px] hidden xl:flex top-[120px] self-start pl-10">
      <div className={`border rounded-md shadow-md bg-white flex flex-col p-3 w-full ${totalPages > 1 ? 'min-h-[320px]' : ''}`}>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">최근 본 여행지</h3>
        <div className="flex-grow space-y-4 relative">
          {paginatedDestinations.length === 0 ? (
            <p className="text-xs text-gray-700">최근 본 여행지가 없습니다.</p>
          ) : (
            paginatedDestinations.map(destination => (
              <Link href={`/destinations/${destination.contentId}`}
                key={destination.contentId}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <p className="text-xs text-gray-700 hover:text-gray-900/90">{destination.title}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeDestination(destination.contentId);
                  }}
                  className="text-xs pl-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove Destination"
                >
                  <X className="size-3.5" />
                </button>
              </Link >
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex justify-center">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <span
                  key={pageIndex}
                  onClick={() => handlePageChange(pageIndex)}
                  className={`cursor-pointer mx-1 size-2 rounded-full ${pageIndex === currentPage ? 'bg-slate-900' : 'bg-slate-400/90'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>


  );
}
