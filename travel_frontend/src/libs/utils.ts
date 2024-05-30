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
