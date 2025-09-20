import React from 'react';
// Make sure to install these:
// npm install @fortawesome/react-fontawesome @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

// This defines the structure of an article object for TypeScript
export type Article = {
  id: number;
  title: string;
  source: string;
  date: string; // Should be an ISO date string e.g., "2025-09-19T10:00:00Z"
  bookmarked: boolean;
};

export default function ArticleCard({ article }: { article: Article }) {
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div>
        <h3 className="line-clamp-3 text-base font-semibold leading-snug text-gray-800 group-hover:text-emerald-700">
          {article.title}
        </h3>
        <p className="mt-2 text-xs text-gray-500">
          {article.source} · {formattedDate}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <button className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium ${
          article.bookmarked
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}>
          <FontAwesomeIcon
            icon={article.bookmarked ? faBookmarkSolid : faBookmark}
            className="h-4 w-4"
          />
          <span>{article.bookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </article>
  );
}