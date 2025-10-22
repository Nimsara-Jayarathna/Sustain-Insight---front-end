import React from "react";

type Props = {
  summary?: string;
  variant?: "landing" | "dashboard";
};

const ArticleSummary: React.FC<Props> = ({ summary, variant }) => {
  // max lines to reserve
  const maxLines = variant === "landing" ? 2 : 3;

  // Map maxLines → fixed min-height (assumes ~21px per line with text-sm)
  const minHeight = maxLines === 2 ? "min-h-[42px]" : "min-h-[63px]";

  return (
    <div
      className={`mt-2 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700 dark:text-slate-300 dark:group-hover:text-slate-200 ${minHeight}`}
    >
      {summary ? (
        <p className={`line-clamp-${maxLines}`}>{summary}</p>
      ) : (
        <span className="opacity-0">placeholder</span>
      )}
    </div>
  );
};

export default ArticleSummary;
