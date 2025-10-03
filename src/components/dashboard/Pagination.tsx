import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // hide if only 1 or 0 pages

  // Helper: create range of pages (for now simple, later can optimize with ellipsis)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      {/* Prev button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded-md border text-sm ${
          currentPage === 1
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border text-sm ${
            page === currentPage
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded-md border text-sm ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
