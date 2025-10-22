import React, { useMemo, useEffect} from 'react';

// This custom hook calculates which page numbers to display, including ellipses.
// It's the perfect logic for the desktop view and remains unchanged.
const usePagination = ({ totalPages, currentPage, siblingCount = 1 }: { totalPages: number; currentPage: number; siblingCount?: number }) => {
  const paginationRange = useMemo(() => {
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

  const jumpToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const changePage = (page: number) => {
    onPageChange(page);
    jumpToTop();
  };

  const onNext = () => changePage(currentPage + 1);
  const onPrevious = () => changePage(currentPage - 1);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentPage > 1) {
        changePage(currentPage - 1);
      }
      if (event.key === "ArrowRight" && currentPage < totalPages) {
        changePage(currentPage + 1);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentPage, totalPages]);

  return (
    <nav
      className="sticky bottom-4 z-20 mx-auto flex w-full max-w-xl items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/90 sm:px-4"
      aria-label="Pagination"
      role="navigation"
    >
      {/* Prev button */}
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800/80"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* --- Responsive Content --- */}
      {/* Mobile View: Shows "Page X of Y" */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Desktop View: Shows intelligent page numbers */}
      <div className="hidden items-center gap-1 sm:flex">
        {paginationRange?.map((page, index) => {
          if (typeof page === 'string') {
            return <span key={`dots-${index}`} className="px-3 py-2 text-sm text-gray-500 dark:text-slate-500">...</span>;
          }
          return (
            <button
              key={page}
              onClick={() => changePage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-full text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
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
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800/80"
      >
        <span className="hidden sm:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </nav>
  );
};

export default Pagination;
