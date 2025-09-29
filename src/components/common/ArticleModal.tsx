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
  showBookmark?: boolean;
};

const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  saved,
  onToggleSave,
  onClose,
  showBookmark = true,
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
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Image */}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="mb-4 w-full rounded-lg object-cover"
          />
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>

        {/* Meta */}
        <div className="mt-2 text-sm text-gray-500 flex gap-4">
          {article.sources && article.sources.length > 0 && (
            <span>From {article.sources[0]}</span>
          )}
          <span>
            {article.publishedAt
              ? new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(article.publishedAt))
              : "Unknown date"}
          </span>
        </div>

        {/* Summary + Content */}
        {article.summary && (
          <p className="mt-4 text-gray-700">{article.summary}</p>
        )}
        {article.content && (
          <p className="mt-2 text-gray-600 whitespace-pre-line">
            {article.content}
          </p>
        )}

        {/* Categories */}
        {article.categories && article.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.categories.map((c, idx) => (
              <span
                key={`${article.id}-cat-${idx}`}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Bookmark Button */}
        {showBookmark && (
          <div className="mt-6">
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors ${
                saved
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <BookmarkIcon size={16} className={saved ? "fill-current" : ""} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;
