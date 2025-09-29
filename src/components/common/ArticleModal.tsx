import React, { useEffect } from "react";

const BookmarkIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

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
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  showBookmark?: boolean; // ✅ Added here
};

const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  saved,
  onToggleSave,
  onClose,
  showBookmark = true, // ✅ default true
}) => {
  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Click outside closes modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Image */}
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-200">
            <span className="text-emerald-600">No Image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Source */}
          {article.sources && article.sources.length > 0 && (
            <p className="mb-3 inline-block rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              From {article.sources[0]}
            </p>
          )}

          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            {article.title}
          </h2>

          {/* Summary */}
          {article.summary && (
            <p className="mb-4 text-gray-700">{article.summary}</p>
          )}

          {/* Content */}
          {article.content && (
            <p className="mb-4 text-gray-600">{article.content}</p>
          )}

          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.categories.map((c: string, idx: number) => (
                <span
                  key={`${article.id}-cat-${idx}`}
                  className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>
              {article.publishedAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(article.publishedAt))
                : "Unknown date"}
            </span>

            {showBookmark && (
              <button
                onClick={onToggleSave}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors duration-300 ${
                  saved
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <BookmarkIcon size={14} className={saved ? "fill-current" : ""} />
                <span>{saved ? "Saved" : "Save"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
