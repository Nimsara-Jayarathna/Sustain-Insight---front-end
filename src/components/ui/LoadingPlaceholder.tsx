import React from "react";
import ArticleGridSkeleton from "../articles/ArticleGridSkeleton";

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-64 text-center">
          <svg className="animate-spin h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-base font-medium text-gray-700">{message || defaultMessages[type]}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingPlaceholder;