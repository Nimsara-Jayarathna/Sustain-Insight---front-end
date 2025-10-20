import React from "react";

// --- Helper Icons (can be moved to a shared file) ---
const BookmarkIcon = ({ filled = false, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const InsightIcon = ({ filled = false, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

type Props = {
  publishedAt?: string;
  allowActions: boolean;
  bookmark: boolean;
  insight: boolean;
  insightCount: number;
  onToggleBookmark: (e: React.MouseEvent) => void; // Pass event
  onToggleInsight: (e: React.MouseEvent) => void; // Pass event
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
  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {publishedAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(publishedAt)) : "Unknown date"}
    </span>

    {allowActions && (
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleBookmark}
          className={`group/action relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            bookmark
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
          }`}
          title={bookmark ? "Remove Bookmark" : "Add Bookmark"}
        >
          <BookmarkIcon filled={bookmark} />
          <span>{bookmark ? "Bookmarked" : "Bookmark"}</span>
          <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-[10px] font-medium text-white shadow-lg transition-opacity duration-200 group-hover/action:inline-flex">
            Toggle bookmark
          </span>
        </button>

        <button
          onClick={onToggleInsight}
          className={`group/action relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            insight
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600"
          }`}
          title={insight ? "Remove Insight" : "Add Insight"}
        >
          <InsightIcon filled={insight} />
          <span>{insightCount}</span>
          <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-full bg-black/80 px-3 py-1 text-[10px] font-medium text-white shadow-lg transition-opacity duration-200 group-hover/action:inline-flex">
            Share insight
          </span>
        </button>
      </div>
    )}
  </div>
);

export default ArticleFooter;
