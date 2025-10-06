import React from 'react';

// This custom hook calculates which page numbers to display, including ellipses.
// It's the perfect logic for the desktop view and remains unchanged.
const usePagination = ({ totalPages, currentPage, siblingCount = 1 }: { totalPages: number; currentPage: number; siblingCount?: number }) => {
  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  return paginationRange;
};


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const paginationRange = usePagination({ currentPage, totalPages });

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  return (
    <nav className="flex items-center justify-between sm:justify-center gap-2" aria-label="Pagination">
      {/* Prev button */}
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* --- Responsive Content --- */}
      {/* Mobile View: Shows "Page X of Y" */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Desktop View: Shows intelligent page numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {paginationRange?.map((page, index) => {
          if (typeof page === 'string') {
            return <span key={`dots-${index}`} className="px-3 py-2 text-sm text-gray-500">...</span>;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center h-10 w-10 rounded-lg text-sm font-medium transition ${
                page === currentPage
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
      {/* --- End Responsive Content --- */}

      {/* Next button */}
      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="hidden sm:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </nav>
  );
};

export default Pagination;