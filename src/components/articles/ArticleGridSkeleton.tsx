// src/components/articles/ArticleGridSkeleton.tsx
import React from "react";

const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    {/* Thumbnail */}
    <div className="h-40 bg-gray-200 w-full" />

    {/* Content */}
    <div className="p-4 flex flex-col flex-1">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3" /> {/* source */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" /> {/* title line 1 */}
      <div className="h-5 bg-gray-300 rounded w-2/3 mb-4" /> {/* title line 2 */}
      <div className="h-3 bg-gray-200 rounded w-full mb-2" /> {/* summary line 1 */}
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" /> {/* summary line 2 */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" /> {/* summary line 3 */}
      <div className="mt-auto flex gap-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full" /> {/* button */}
        <div className="h-6 w-14 bg-gray-200 rounded-full" /> {/* button */}
      </div>
    </div>
  </div>
);

const ArticleGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default ArticleGridSkeleton;
