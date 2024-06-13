import React, { useEffect, useState, useRef } from 'react';
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
const MAX_RECENT_DESTINATIONS = 30;

export default function RecentDestinations({ newDestination }: RecentDestinationsProps) {
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const shouldUpdateLocalStorage = useRef(true);

  useEffect(() => {
    const storedDestinations = localStorage.getItem('recentDestinations');
    if (storedDestinations) {
      setDestinations(JSON.parse(storedDestinations));
    }
  }, []);

  useEffect(() => {
    if (newDestination && shouldUpdateLocalStorage.current) {
      setDestinations(prevDestinations => {
        const isDuplicateIndex = prevDestinations.findIndex(d => d.contentId === newDestination.contentId);
        let updatedDestinations;

        if (isDuplicateIndex !== -1) {
          // 최근 본 여행지를 리스트의 맨앞으로 옮김- 기존의 리스트에 있을 경우
          const [existingDestination] = prevDestinations.splice(isDuplicateIndex, 1);
          updatedDestinations = [existingDestination, ...prevDestinations];
        } else {
          // 최근 본 여행지를 리스트의 맨앞으로 옮김
          updatedDestinations = [newDestination, ...prevDestinations];
        }

        if (updatedDestinations.length > MAX_RECENT_DESTINATIONS) {
          updatedDestinations = updatedDestinations.slice(0, MAX_RECENT_DESTINATIONS);
        }

        localStorage.setItem('recentDestinations', JSON.stringify(updatedDestinations));
        return updatedDestinations;
      });
    } else {
      shouldUpdateLocalStorage.current = true;
    }
  }, [newDestination]);

  const removeDestination = (contentId: string) => {
    shouldUpdateLocalStorage.current = false; // 현재 페이지에서 삭제 버튼 눌렀을때, 다시 저장 방지.
    const updatedDestinations = destinations.filter(d => d.contentId !== contentId);
    localStorage.setItem('recentDestinations', JSON.stringify(updatedDestinations));
    setDestinations(updatedDestinations);
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
              <Link href=
                {Number(destination.contentId) > 100 ?
                  `/destinations/${destination.contentId}` :
                  `/festivals/${destination.contentId}`}
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
