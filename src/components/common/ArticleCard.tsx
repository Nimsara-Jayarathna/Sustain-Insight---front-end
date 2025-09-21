import React, { useState } from "react";

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
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md ring-1 ring-gray-200 transition hover:shadow-lg hover:ring-emerald-300">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Source */}
        {article.sources && article.sources.length > 0 && (
          <p className="mb-2 text-xs font-medium text-emerald-700">
            From <span className="font-semibold">{article.sources[0]}</span>
          </p>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold text-gray-900 leading-snug group-hover:text-emerald-700">
          {article.title}
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

        {/* Categories as tags */}
        {article.categories && article.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.categories.map((c, idx) => (
              <span
                key={`${article.id}-cat-${idx}`}
                className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Spacer so footer aligns */}
        <div className="flex-grow" />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            {article.publishedAt
              ? new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(article.publishedAt))
              : "Unknown date"}
          </span>
          <button
            onClick={() => setSaved(!saved)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              saved
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
