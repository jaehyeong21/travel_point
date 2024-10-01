
import { useState } from 'react';

// 페이지네이션을 위한 데이터를 처리하는 함수
export function usePaginatedData(data: any[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return { currentPage, setCurrentPage, totalPages, paginatedData };
}
