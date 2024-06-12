'use client';
import { Action, useRegisterActions } from "kbar";
import { Book, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import pako from "pako";
import { useEffect, useState } from "react";

export default function KbarContent ({ children }: { children: React.ReactNode }){
  const router = useRouter();
  const [searchIndex, setSearchIndex] = useState<Action[]>([]);

  useEffect(() => {
    const fetchAndDecompressData = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const compressedData = await response.arrayBuffer();
      const decompressedData = pako.inflate(new Uint8Array(compressedData), { to: 'string' });
      return JSON.parse(decompressedData);
    };

    const loadData = async () => {
      try {
        const data = await fetchAndDecompressData('/assets/search/searchIndex.json.gz');
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          subtitle: item.loc,
          perform: () => router.push(`/destinations/${item.id}`),
          parent: "search",
          section: 'Destinations',
        }));
        setSearchIndex(formattedData); // 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch and decompress data:', error);
      }
    };

    loadData();
  }, [router]);  

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

  useRegisterActions(actions, []); // 기본 액션 등록
  useRegisterActions(searchIndex, [searchIndex]); // searchIndex가 변경될 때마다 액션 등록=라우팅 후 등록

  return (
    <>
      {children}
    </>
  );
};