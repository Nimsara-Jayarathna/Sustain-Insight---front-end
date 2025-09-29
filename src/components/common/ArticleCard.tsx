import React, { useState } from "react";
import ArticleModal from "./ArticleModal";

// --- INLINE ICONS ---
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

const LeafIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h4l2-3 2 3h4a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7Z" />
    <path d="M12 18A3 3 0 0 0 9 15" />
  </svg>
);

type ArticleCardProps = {
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
  variant?: "landing" | "dashboard";
  showBookmark?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "dashboard",
  showBookmark = true,
}) => {
  const [saved, setSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSave = () => setSaved(!saved);

  return (
    <>
      <article
        onClick={() => setIsModalOpen(true)}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-200">
              <LeafIcon className="h-12 w-12 text-emerald-400 opacity-70" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {article.sources && article.sources.length > 0 && (
            <p className="mb-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              From {article.sources[0]}
            </p>
          )}

          <h3 className="text-lg font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-emerald-700 line-clamp-2">
            {article.title}
          </h3>

          {article.summary && (
            <p
              className={`mt-2 text-sm text-gray-600 ${
                variant === "landing" ? "line-clamp-2" : "line-clamp-3"
              }`}
            >
              {article.summary}
            </p>
          )}

          <div className="flex-grow" />

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
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
                onClick={(e) => {
                  e.stopPropagation(); // prevent modal open
                  toggleSave();
                }}
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
      </article>

      {isModalOpen && (
        <ArticleModal
          article={article}
          saved={saved}
          onToggleSave={toggleSave}
          onClose={() => setIsModalOpen(false)}
          showBookmark={showBookmark}
        />
      )}
    </>
  );
};

export default ArticleCard;
