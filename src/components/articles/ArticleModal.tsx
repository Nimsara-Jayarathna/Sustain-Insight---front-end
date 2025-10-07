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
  onToggleBookmark: (e: React.MouseEvent) => void;
  onToggleInsight: (e: React.MouseEvent) => void;
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex flex-col w-full max-w-3xl bg-white shadow-xl rounded-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Redesigned Header --- */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 sm:p-5 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-4">{article.title}</h2>
          <button aria-label="Close" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100 flex-shrink-0">×</button>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="flex-grow p-4 sm:p-5 overflow-y-auto">
          <div className="mb-4">
            <ArticleThumbnail imageUrl={article.imageUrl} title={article.title} />
          </div>
          <div className="mb-4">
            <ArticleSource sources={article.sources} />
          </div>
          <ArticleSummary summary={article.summary} variant="dashboard" />

          {/* Full Content */}
          <div className="mt-4 prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-line">
            {article.content || ""}
          </div>

          <div className="mt-6">
            <ArticleCategories articleId={article.id} categories={article.categories} />
          </div>
        </div>

        {/* --- Redesigned Footer --- */}
        {allowActions && (
          <div className="flex-shrink-0 p-4 sm:p-5 bg-white border-t border-gray-200">
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