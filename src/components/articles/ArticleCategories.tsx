import React from "react";

type Props = {
  articleId: string | number;
  categories?: string[];
};

const ArticleCategories: React.FC<Props> = ({ articleId, categories }) => (
  <div className="mt-3 flex flex-wrap gap-2 min-h-[28px]">
    {categories && categories.length > 0 ? (
      categories.map((c, idx) => (
        <span
          key={`${articleId}-cat-${idx}`}
          className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
        >
          {c}
        </span>
      ))
    ) : (
      <span className="opacity-0">placeholder</span>
    )}
  </div>
);

export default ArticleCategories;
