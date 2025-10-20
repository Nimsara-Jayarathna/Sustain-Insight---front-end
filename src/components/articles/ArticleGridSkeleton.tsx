// src/components/articles/ArticleGridSkeleton.tsx
import React from "react";

const SkeletonCard = () => (
  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    <div className="aspect-[16/9] w-full bg-gray-200" />
    <div className="flex flex-1 flex-col gap-3 px-4 py-5 sm:px-5">
      <div className="h-4 w-24 rounded-full bg-gray-200" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded-full bg-gray-300" />
        <div className="h-5 w-2/3 rounded-full bg-gray-300" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-gray-200" />
        <div className="h-3 w-5/6 rounded-full bg-gray-200" />
        <div className="h-3 w-2/3 rounded-full bg-gray-200" />
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="h-3 w-24 rounded-full bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

const ArticleGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default ArticleGridSkeleton;
