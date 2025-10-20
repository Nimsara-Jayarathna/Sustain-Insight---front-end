import React from "react";

type Props = {
  articleId: string | number;
  categories?: string[];
};

const ArticleCategories: React.FC<Props> = ({ articleId, categories }) => (
  <div className="mt-4 flex min-h-[30px] flex-wrap gap-2">
    {categories && categories.length > 0 ? (
      categories.slice(0, 3).map((c, idx) => (
        <span
          key={`${articleId}-cat-${idx}`}
          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors duration-300 group-hover:bg-emerald-50 group-hover:text-emerald-700"
        >
          #
          {c}
        </span>
      ))
    ) : (
      <span className="opacity-0">placeholder</span>
    )}
  </div>
);

export default ArticleCategories;
