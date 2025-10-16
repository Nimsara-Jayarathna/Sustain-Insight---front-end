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
  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 min-h-[32px] pt-4 border-t border-gray-100">
    <span className="text-xs">
      {publishedAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(publishedAt)) : "Unknown date"}
    </span>

    {allowActions && (
      <div className="flex items-center gap-4">
        {/* Bookmark Button */}
        <button
          onClick={onToggleBookmark}
          className={`flex items-center gap-1.5 font-medium transition-colors ${bookmark ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"}`}
          title={bookmark ? "Remove Bookmark" : "Add Bookmark"}
        >
          <BookmarkIcon filled={bookmark} />
          <span className="text-xs">{bookmark ? "Bookmarked" : "Bookmark"}</span>
        </button>

        {/* Insight Button */}
        <button
          onClick={onToggleInsight}
          className={`flex items-center gap-1.5 font-medium transition-colors ${insight ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
          title={insight ? "Remove Insight" : "Add Insight"}
        >
          <InsightIcon filled={insight} />
          <span className="text-xs">{insightCount}</span>
        </button>
      </div>
    )}
  </div>
);

export default ArticleFooter;