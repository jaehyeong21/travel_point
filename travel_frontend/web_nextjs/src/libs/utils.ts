import { CATEGORIES } from "@/data/data";
import { CategoryName } from "@/types/categoriy-types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterArray = (arr: (string | null)[]): string[] => {
  return arr.filter((item): item is string => item !== null && item !== "");
};

// 상세페이지 평점 별 계산기
export function calculateStarRating(rating: number) {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return { fullStars, hasHalfStar, emptyStars };
}

// 기본 데이터 생성 함수 - 임시
export function generateData() {
  return [...Array(16)].map((_, i) => ({
    location: '강원특별자치도 춘천시',
    title: `대관령 삼양목장 ${i}`,
    description: '정답게 이야기를 나눌 수 있는',
  }));
}

// 날짜 포맷을 변경하는 함수
export function formatDateRange(startDate: string, endDate: string): string {
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${year}.${month}.${day}`;
  };

  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
}

// 이벤트 상태를 반환하는 함수
export function getEventStatus(startDate: string, endDate: string): { status: string, dDay: string } {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (currentDate >= start && currentDate <= end) {
    return { status: '진행중', dDay: '' };
  } else if (currentDate < start) {
    const diffTime = start.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: '진행 예정', dDay: `D-${diffDays}` };
  } else {
    return { status: '종료', dDay: '' };
  }
}


// cat1, cat2, cat3를 실제 카테고리(한글)로 변경하는 함수
export function getCategoryName(cat1: string, cat2: string, cat3: string): CategoryName {
  const category1 = CATEGORIES[cat1];
  if (!category1) return {};

  const category2 = category1.subCategories[cat2];
  if (!category2) return { cat2: category1.name };

  const category3 = category2.details[cat3];
  return {
    cat2: category2.name,
    cat3: category3,
  };
}

export function throttleHelper(callback: () => void, waitTime: number): () => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function () {
    if (timerId === null) {
      timerId = setTimeout(() => {
        callback();
        timerId = null;
      }, waitTime);
    }
  };
}