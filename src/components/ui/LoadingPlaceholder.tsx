// src/components/ui/LoadingPlaceholder.tsx
import React from "react";
import ArticleGridSkeleton from "../articles/ArticleGridSkeleton";

type Props = {
  type: "articles" | "bookmarks" | "foryou";
  mode?: "skeleton" | "blocking"; // skeleton grid OR blocking overlay
  count?: number; // for skeleton count
  message?: string; // Custom message for blocking mode
};

const defaultMessages: Record<Props["type"], string> = {
  articles: "Fetching the latest news articles...",
  bookmarks: "Loading your saved bookmarks...",
  foryou: "Personalizing your news feed...",
};

const LoadingPlaceholder: React.FC<Props> = ({ type, mode = "skeleton", count = 9, message }) => {
  if (mode === "skeleton") {
    return <ArticleGridSkeleton count={count} />;
  }

  if (mode === "blocking") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-emerald-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-base font-medium text-gray-700">{message || defaultMessages[type]}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingPlaceholder;
