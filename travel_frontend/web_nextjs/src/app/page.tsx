
import PageLayout from "@/components/layout/page-layout";
import MainHero from "@/components/section/mainPage/main-hero";
import RegionRecommendation from "@/components/section/mainPage/region-recommendation";
import { Separator } from "@/components/ui/separator";
import TrendingDestinations from "@/components/section/mainPage/trending-destinations";
import ThemeRecommendation from "@/components/section/mainPage/theme-recommendation";
import FestivalRecommendation from "@/components/section/mainPage/festival-recommendation";
import { Metadata } from "next/types";
import { siteConfig } from "@/config/site-config";
import RegionSelection from "@/components/common/region-selection";

export const metadata: Metadata = {
  title: '국내 여행 추천',
  description: siteConfig.description
};

export default function Home() {

  return (
    <main className="">
      {/* 히어로 섹션 */}
      <MainHero />
      <PageLayout>
        {/* 지역 섹션 */}
        <RegionRecommendation />
        <RegionSelection title="다른 지역 여행지 구경가기" page="mainpage" className="hidden xsm:block"/>
        <Separator className="my-10 md:my-20 hidden xsm:block" />
        {/* 추천 섹션 - 백엔드 미구현*/}
        {/* <TrendingDestinations /> */}
        {/* <Separator className="my-10 md:my-20" /> */}
        {/* 테마 섹션 */}
        <ThemeRecommendation />
        <Separator className="my-10 md:mt-20" />
        {/* 축제 섹션 */}
        <FestivalRecommendation count="12" />
      </PageLayout>
    </main>
  );
}
