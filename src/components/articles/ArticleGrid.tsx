import React, { useMemo } from "react";
import ArticleCard from "./ArticleCard";

type ArticleGridProps = {
  articles: any[];
  isLoading?: boolean; // ✅ New optional prop
  variant?: "landing" | "dashboard";
  mode?: "grid" | "carousel";
  speed?: number;
  disablePopup?: boolean;
};

// --- 1. A private, internal skeleton component. No new file needed. ---
const InternalSkeletonCard: React.FC = () => (
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

// --- 2. An empty state for when there are truly no articles ---
const EmptyState = () => (
  <div className="text-center text-gray-600 col-span-full mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6M7 8h6v4H7V8z" />
    </svg>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Articles Found</h3>
    <p className="max-w-md mx-auto">It looks like there are no articles available at the moment. Please check back later.</p>
  </div>
);

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  isLoading = false,
  variant = "dashboard",
  mode = "grid",
  speed = 50,
  disablePopup = false,
}) => {
  // --- 3. The main component logic ---
  
  // If we are in a loading state, render the appropriate skeleton layout.
  if (isLoading) {
    if (mode === 'carousel') {
      return (
        <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
          <div className="flex gap-6 lg:gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-[80vw] sm:w-1/2 lg:w-1/3">
                <InternalSkeletonCard />
              </div>
            ))}
          </div>
        </div>
      );
    }
    const gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return (
      <div className={`grid ${gridClasses} gap-y-8 gap-x-6 scroll-mt-24 lg:gap-y-10`}>
        {Array.from({ length: 3 }).map((_, idx) => <InternalSkeletonCard key={idx} />)}
      </div>
    );
  }

  // If not loading, and there are no articles, show the empty state.
  if (!articles || articles.length === 0) {
    return <EmptyState />;
  }

  // If not loading, and there are articles, render them.
  if (mode === "carousel") {
    const loopArticles = useMemo(() => [...articles, ...articles], [articles]);
    return (
      <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
        <div className="flex animate-scroll gap-6 lg:gap-8" style={{ animationDuration: `${(loopArticles.length * 300) / speed}s` }}>
          {loopArticles.map((article, idx) => (
            <div key={`${article.id}-${idx}`} className="flex-shrink-0 w-[80vw] sm:w-1/2 lg:w-1/3">
              <ArticleCard article={article} variant={variant} disablePopup={disablePopup} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid ${gridClasses} gap-y-8 gap-x-6 scroll-mt-24 lg:gap-y-10`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} disablePopup={disablePopup} />
      ))}
    </div>
  );
};

export default ArticleGrid;
