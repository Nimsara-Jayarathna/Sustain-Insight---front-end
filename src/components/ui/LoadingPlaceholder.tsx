import React from "react";
import ArticleGridSkeleton from "../articles/ArticleGridSkeleton";
import GradientSpinner from "./GradientSpinner";

type Props = {
  type: "articles" | "bookmarks" | "foryou";
  mode?: "skeleton" | "blocking";
  count?: number;
  message?: string;
};

const defaultMessages: Record<Props["type"], string> = {
  articles: "Fetching the latest news articles...",
  bookmarks: "Loading your saved bookmarks...",
  foryou: "Personalizing your news feed...",
};

const LoadingPlaceholder: React.FC<Props> = ({ type, mode = "skeleton", count = 9, message }) => {
  if (mode === "skeleton") {
    // This logic is unchanged.
    return <ArticleGridSkeleton count={count} />;
  }

  // This JSX is REDESIGNED to match the new style.
  if (mode === "blocking") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
        <div className="flex w-64 flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-colors dark:bg-slate-900">
          <GradientSpinner />
          <p className="text-base font-medium text-gray-700 dark:text-slate-200">{message || defaultMessages[type]}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingPlaceholder;
