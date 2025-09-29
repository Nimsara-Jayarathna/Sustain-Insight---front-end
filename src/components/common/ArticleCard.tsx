import React, { useState } from "react";

// --- INLINE SVG ICONS (No installation needed) ---

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

// Thematic icon for the placeholder
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


// --- ARTICLE CARD COMPONENT ---

type ArticleCardProps = {
  article: {
    id: number | string;
    title: string;
    summary?: string;
    imageUrl?: string;
    publishedAt?: string;
    sources?: string[];
    categories?: string[];
  };
  variant?: "landing" | "dashboard";
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "dashboard",
}) => {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      
      {/* Image container: Now includes a placeholder */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // Placeholder with a green gradient and a thematic icon
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-200">
            <LeafIcon className="h-12 w-12 text-emerald-400 opacity-70" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          {/* Source Styling */}
          {article.sources && article.sources.length > 0 && (
            <p className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              From {article.sources[0]}
            </p>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-emerald-700">
          <a href="#" className="line-clamp-3">
            {article.title}
          </a>
        </h3>

        {/* Summary */}
        {article.summary && (
          <p
            className={`mt-2 text-sm text-gray-600 ${
              variant === "landing" ? "line-clamp-2" : "line-clamp-3"
            }`}
          >
            {article.summary}
          </p>
        )}

        {/* Spacer to push footer to the bottom */}
        <div className="flex-grow" />

        {/* Categories & Footer Section */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Category Tags */}
          {article.categories && article.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
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

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {article.publishedAt
                ? new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(article.publishedAt))
                : "Unknown date"}
            </span>

            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                saved
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-400"
              }`}
            >
              <BookmarkIcon size={14} className={saved ? "fill-current" : ""} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;