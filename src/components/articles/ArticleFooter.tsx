import React from "react";

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

type Props = {
  publishedAt?: string;
  allowActions: boolean;
  bookmark: boolean;
  insight: boolean; // ✅ added
  insightCount: number;
  onToggleBookmark: () => void;
  onToggleInsight: () => void;
};

const ArticleFooter: React.FC<Props> = ({
  publishedAt,
  allowActions,
  bookmark,
  insight,
  insightCount,
  onToggleBookmark,
  onToggleInsight,
}) => (
  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 min-h-[32px]">
    <span>
      {publishedAt
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(publishedAt))
        : "Unknown date"}
    </span>

    {allowActions && (
      <div className="flex gap-2">
        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark();
          }}
          className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs transition-colors ${
            bookmark
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          <BookmarkIcon size={14} className={bookmark ? "fill-current" : ""} />
          {bookmark ? "Bookmarked" : "Bookmark"}
        </button>

        {/* Insight */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleInsight();
          }}
          className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs transition-colors ${
            insight
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          💡 {insightCount}
        </button>
      </div>
    )}
  </div>
);

export default ArticleFooter;
