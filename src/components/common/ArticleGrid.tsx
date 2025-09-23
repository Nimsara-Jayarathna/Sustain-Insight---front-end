import React from "react";
import ArticleCard from "./ArticleCard";

type ArticleGridProps = {
  articles: any[];
  variant?: "landing" | "dashboard";
};

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, variant = "dashboard" }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant={variant} />
      ))}
    </div>
  );
};

export default ArticleGrid;
