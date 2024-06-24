'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentDestinationsTab from "@/components/section/mypage/recent-destination-tab";
import RecommendationTab from "@/components/section/mypage/recommandation-tab";
import BookmarkTab from "@/components/section/mypage/bookmark-tab";

// 탭 섹션을 렌더링하는 함수 
export default function MypageTabSection() {
  const ITEM_PER_PAGE = 6;  
  
  // const { currentPage, setCurrentPage, totalPages, paginatedData } = usePaginatedData(data, ITEM_PER_PAGE);
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
          <BookmarkTab/>
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
