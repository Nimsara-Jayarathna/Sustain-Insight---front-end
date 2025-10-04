import React, { useEffect } from "react";
import ArticleThumbnail from "./ArticleThumbnail";
import ArticleSource from "./ArticleSource";
import ArticleSummary from "./ArticleSummary";
import ArticleCategories from "./ArticleCategories";
import ArticleFooter from "./ArticleFooter";

type ArticleModalProps = {
  article: {
    id: number | string;
    title: string;
    summary?: string;
    content?: string;
    imageUrl?: string;
    publishedAt?: string;
    sources?: string[];
    categories?: string[];
  };
  bookmark: boolean;
  insight: boolean;
  insightCount: number;
  onToggleBookmark: () => void;
  onToggleInsight: () => void;
  onClose: () => void;
  allowActions?: boolean;
};

const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  bookmark,
  insight,
  insightCount,
  onToggleBookmark,
  onToggleInsight,
  onClose,
  allowActions = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Thumbnail */}
        <div className="mb-4">
          <ArticleThumbnail imageUrl={article.imageUrl} title={article.title} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 min-h-[56px]">
          {article.title}
        </h2>

        {/* Meta */}
        <ArticleSource sources={article.sources} />

        {/* Summary */}
        <ArticleSummary summary={article.summary} variant="dashboard" />

        {/* Content */}
        <div className="mt-4 min-h-[120px]">
          {article.content ? (
            <p className="text-gray-600 whitespace-pre-line">{article.content}</p>
          ) : (
            <span className="opacity-0">placeholder</span>
          )}
        </div>

        {/* Categories */}
        <ArticleCategories articleId={article.id} categories={article.categories} />

        {/* Footer (actions) */}
        {allowActions && (
          <div className="mt-6">
            <ArticleFooter
              publishedAt={article.publishedAt}
              allowActions={true}
              bookmark={bookmark}
              insight={insight}
              insightCount={insightCount}
              onToggleBookmark={onToggleBookmark}
              onToggleInsight={onToggleInsight}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;
