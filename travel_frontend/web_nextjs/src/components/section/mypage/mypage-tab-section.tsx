'use client';
import DestinationCard from "@/components/common/destination-card";
import DestinationPagination from "@/components/common/destination-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentDestinationsTab from "@/components/section/mypage/recent-destination-tab";
import { X } from "lucide-react";
import { generateData } from "@/libs/utils";
import { usePaginatedData } from "@/hooks/use-pagination";
import RecommendationTab from "./recommandation-tab";

// 탭 섹션을 렌더링하는 함수 
export default function MypageTabSection() {
  const ITEM_PER_PAGE = 6;
  // 데이터 목록 (나중에 데이터 API 추가해야됨.)
  const data = generateData();
  const { currentPage, setCurrentPage, totalPages, paginatedData } = usePaginatedData(data, ITEM_PER_PAGE);
  return (
    <Tabs defaultValue="myFavs" className="w-full rounded-none" id='mainSection'>
      <TabsList className='w-full py-6 flex space-x-0 xsm:space-x-8'>
        <TabsTrigger value="myFavs" className='underline-link text-[10px] xsm:text-xs sm:text-sm'>내가 찜한 여행지</TabsTrigger>
        <TabsTrigger value="myComments" className='underline-link text-[10px] xsm:text-xs sm:text-sm'>내가 쓴 리뷰</TabsTrigger>
        <TabsTrigger value="recentDestionation" className='underline-link text-[10px] xsm:text-xs sm:text-sm'>최근 본 여행지</TabsTrigger>
        <TabsTrigger value="recommendation" className='underline-link text-[10px] xsm:text-xs sm:text-sm'>추천 받은 여행지</TabsTrigger>
      </TabsList>
      {/* 내가 찜한 여행지 */}
      <TabsContent value="myFavs">
        <div className="p-1 sm:p-4">
          {data ? paginatedData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:px-12 py-2">
              {paginatedData.map((item: any, index: number) => (
                <div key={index} className="px-4 relative">
                  <button
                    onClick={() => { }}
                    className="absolute top-0 right-0 text-xs pl-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Destination"
                  >
                    <X className="size-3.5" />
                  </button>
                  <DestinationCard
                    location={item.location}
                    title={item.title}
                    description={item.description}
                  />
                </div>
              ))}
              <div className='flex justify-center pb-8 mt-5 col-span-2 md:col-span-3'>
                <DestinationPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={() => { }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 text-sm">
              <p className="text-gray-600">내가 찜한 여행지가 없습니다.</p>
            </div>
          ) : <div className="flex flex-col items-center justify-center text-center space-y-4 text-sm">
            <p className="text-gray-600">내가 찜한 여행지가 없습니다.</p>
          </div>}
        </div>
      </TabsContent>
      {/* 내가 쓴 리뷰 */}
      <TabsContent value="myComments">
        <div className="p-1 sm:p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4 text-sm">
            <p className="text-gray-600">내가 쓴 리뷰가 없습니다.</p>
          </div>
        </div>
      </TabsContent>
      {/* 최근 본 여행지 */}
      <TabsContent value="recentDestionation">
        <div className="p-1 sm:p-4">
          <RecentDestinationsTab />
        </div>
      </TabsContent>
      {/* 추천 받은 여행지 */}
      <TabsContent value="recommendation">
        <div className="p-1 sm:p-4">
          <RecommendationTab />
        </div>
      </TabsContent>
    </Tabs>
  );
}
