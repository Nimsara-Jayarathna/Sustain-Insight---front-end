import React, { useMemo } from "react";
import ArticleCard from "./ArticleCard";

type ArticleGridProps = {
  articles: any[];
  variant?: "landing" | "dashboard";
  mode?: "grid" | "carousel";
  speed?: number; // pixels per second
};

const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  variant = "dashboard",
  mode = "grid",
  speed = 50, // adjust lower = slower, higher = faster
}) => {
  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No articles found.</p>;
  }

  if (mode === "carousel") {
  const loopArticles = useMemo(() => [...articles, ...articles], [articles]);

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex animate-scroll gap-6"
        style={{ animationDuration: `${(loopArticles.length * 300) / speed}s` }}
      >
        {loopArticles.map((article, idx) => (
          <div
            key={`${article.id}-${idx}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
          >
            <ArticleCard article={article} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
  // fallback grid
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  );
};

export default ArticleGrid;
