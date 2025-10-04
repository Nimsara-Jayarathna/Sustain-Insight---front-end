import React, { useState } from "react";
import ArticleModal from "./ArticleModal";
import ActionModal from "./ActionModal"; // ✅ unified modal

import { addBookmark, removeBookmark } from "../../api/bookmarks";
import { addInsight, removeInsight } from "../../api/insights";

// --- ICONS ---
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
    bookmarked?: boolean;
    insighted?: boolean;
    insightCount?: number;
  };
  variant?: "landing" | "dashboard";
  disablePopup?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "dashboard",
  disablePopup = false,
}) => {
  const [bookmark, setBookmark] = useState(article.bookmarked ?? false);
  const [insight, setInsight] = useState(article.insighted ?? false);
  const [insightCount, setInsightCount] = useState(article.insightCount ?? 0);
  const [open, setOpen] = useState(false);

  // Unified modal state
  const [modal, setModal] = useState<{
    open: boolean;
    action: "bookmark" | "insight";
    type: "loading" | "success" | "error";
    message: string;
  }>({ open: false, action: "bookmark", type: "loading", message: "" });

  const toggleBookmark = async () => {
    if (modal.open) return;
    setModal({ open: true, action: "bookmark", type: "loading", message: "Updating bookmark..." });

    try {
      if (bookmark) {
        await removeBookmark(article.id);
        setBookmark(false);
        setModal({ open: true, action: "bookmark", type: "success", message: "Bookmark removed!" });
      } else {
        await addBookmark(article.id);
        setBookmark(true);
        setModal({ open: true, action: "bookmark", type: "success", message: "Article bookmarked!" });
      }
    } catch (err) {
      console.error("Bookmark toggle failed", err);
      setModal({
        open: true,
        action: "bookmark",
        type: "error",
        message: "Failed to update bookmark",
      });
    }
  };

  const toggleInsight = async () => {
    if (modal.open) return;
    setModal({ open: true, action: "insight", type: "loading", message: "Updating insight..." });

    try {
      if (insight) {
        await removeInsight(article.id);
        setInsight(false);
        setInsightCount((c) => Math.max(0, c - 1));
        setModal({ open: true, action: "insight", type: "success", message: "Insight removed!" });
      } else {
        await addInsight(article.id);
        setInsight(true);
        setInsightCount((c) => c + 1);
        setModal({ open: true, action: "insight", type: "success", message: "Insight added!" });
      }
    } catch (err) {
      console.error("Insight toggle failed", err);
      setModal({
        open: true,
        action: "insight",
        type: "error",
        message: "Failed to update insight",
      });
    }
  };

  const allowActions = variant === "dashboard";

  return (
    <>
      <article
        onClick={() => {
          if (!disablePopup) setOpen(true);
        }}
        className={`group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${
          disablePopup ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {/* IMAGE */}
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

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-5">
          {article.sources && article.sources.length > 0 && (
            <p className="mb-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white w-fit">
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

          {article.categories && article.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {article.categories.map((c, idx) => (
                <span
                  key={`${article.id}-cat-${idx}`}
                  className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="flex-grow" />

          {/* FOOTER */}
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

            {allowActions && (
              <div className="flex gap-2">
                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark();
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

                {/* Insight Button (💡 + count only) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInsight();
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
        </div>
      </article>

      {open && (
        <ArticleModal
          article={article}
          bookmark={bookmark}
          insight={insight}
          onToggleBookmark={toggleBookmark}
          onToggleInsight={toggleInsight}
          onClose={() => setOpen(false)}
          allowActions={allowActions}
        />
      )}

      {/* Unified feedback modal */}
      {modal.open && (
        <ActionModal
          action={modal.action}
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, open: false })}
        />
      )}
    </>
  );
};

export default ArticleCard;
