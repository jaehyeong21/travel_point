import { PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";

// 현재 페이지와 총 페이지 수에 따라 페이지 번호를 생성하는 함수
export function generatePageNumbers(currentPage: number, totalPages: number): number[] {
  const pageNumbers = [];
  if (totalPages <= 3) {
    // 총 페이지 수가 3 이하인 경우, 모든 페이지를 표시
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      // 현재 페이지가 3 이하인 경우, 처음 4개의 페이지를 표시
      pageNumbers.push(1, 2, 3);
      if (totalPages > 3) {
        pageNumbers.push(4);
      }
    } else if (currentPage >= totalPages - 2) {
      // 현재 페이지가 마지막에 가까운 경우, 마지막 4개의 페이지를 표시
      pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // 그 외의 경우, 현재 페이지와 이전 및 다음 페이지를 표시
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    }
  }
  return pageNumbers;
}


interface RenderPageNumbersProps {
  pageNumbers: number[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  createPageUrl?: (pageNumber: number | string) => string;
  isDisabled?: boolean;
}

// 필요에 따라 생략 기호를 포함하여 페이지 번호를 렌더링하는 함수
export function renderPageNumbers({ pageNumbers, currentPage, totalPages, onPageChange, createPageUrl, isDisabled }: RenderPageNumbersProps) {
  const showLeftEllipsis = currentPage > 3;
  const showRightEllipsis = currentPage < totalPages - 2;

  if (totalPages < 1) return;
  return (
    <div className="hidden sm:flex">
      {showLeftEllipsis && (
        <>
          <PaginationItem>
            <PaginationLink
              href={createPageUrl ? createPageUrl(1) : '#mainSection'}
              onClick={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  onPageChange(1);
                }
              }}
              disabled={isDisabled}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="px-3 py-1" />
          </PaginationItem>
        </>
      )}
      {pageNumbers.map(number => (
        <PaginationItem key={number}>
          <PaginationLink
            href={createPageUrl ? createPageUrl(number) : '#mainSection'}
            isActive={number === currentPage}
            onClick={(e) => {
              e.preventDefault();
              if (number !== currentPage && !isDisabled) {
                onPageChange(number);
              }
            }}
            disabled={isDisabled}
            className={number === currentPage ? 'text-gray-500 cursor-not-allowed' : ''}
          >
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
      {showRightEllipsis &&
        totalPages === 5 ? <>
          <PaginationItem>
            <PaginationLink
              href={createPageUrl ? createPageUrl(totalPages) : '#mainSection'}
              onClick={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  onPageChange(totalPages);
                }
              }}
              disabled={isDisabled}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </> :
        totalPages < 4 ? '' :
          totalPages < 15 ? (
            <>
              <PaginationItem>
                <PaginationEllipsis className="px-3 py-1" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={createPageUrl ? createPageUrl(totalPages) : '#mainSection'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isDisabled) {
                      onPageChange(totalPages);
                    }
                  }}
                  disabled={isDisabled}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : <PaginationEllipsis className="px-3 py-1" />}
    </div>
  );
}