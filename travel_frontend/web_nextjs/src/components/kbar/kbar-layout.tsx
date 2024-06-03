'use client';

import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch, KBarProvider, Action } from "kbar";
import { useRouter } from "next/navigation";
import { Book, Home, Search } from "lucide-react";
import RenderResults from "@/components/kbar/kbar-result";

export default function KbarLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const searchIndex = [];

  for (let i = 1; i <= 7999; i++) {
    searchIndex.push({
      id: i.toString(),
      name: `Fake Place ${i}`,
      subtitle: `Fake Subtitle ${i}`,
      perform: () => router.push(`/destinations/${i}`),
      parent: "search",
      section: 'Destinations',
    });
  }
  // 마지막 데이터 추가
  searchIndex.push({
    id: "126273",
    name: "불국사",
    subtitle: "경상북도 경주시",
    perform: () => router.push('/destinations/126273'),
    parent: "search",
    section: 'Destinations',
  });

  const actions: Action[] = [
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["h"],
      keywords: "back",
      section: "Navigation",
      perform: () => router.push("/"),
      icon: <Home className="w-6 h-6 mx-3" />,
      subtitle: "메인페이지로 이동하기",
    },
    {
      id: "recommendationAction",
      name: "Recommendations",
      shortcut: ["rec"],
      keywords: "recommendations",
      section: "Navigation",
      icon: <Book className="w-6 h-6 mx-3" />,
      perform: () => router.push("/recommendations"),
      subtitle: "추천페이지로 이동하기",
    },
    {
      id: "search",
      name: "Search Destinations",
      keywords: "search destinations",
      section: "Destinations",
      icon: <Search className="w-6 h-6 mx-3" />,
      subtitle: "여행지 검색",
    },
  ];

  const combinedActions = actions.concat(searchIndex);

  return (
    <KBarProvider actions={combinedActions}>
      <KBarPortal>
        <KBarPositioner className="pointer-events-none fixed inset-0 h-full w-full bg-white/60 backdrop-blur-sm z-[999]">
          <KBarAnimator className="max-w-3xl w-full sm:w-1/2 overflow-hidden rounded-lg shadow-xl border bg-slate-100 "
            style={{ boxShadow: '0 16px 70px rgb(0 0 0 / 20%)' }}>
            <KBarSearch defaultPlaceholder="검색어를 입력하세요." className="bg-slate-100 w-full border-none px-6 py-4 text-slate-600 outline-none placeholder:text-slate-400" />
            <div className="kbar-scrollbar pb-4 mt-2">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
