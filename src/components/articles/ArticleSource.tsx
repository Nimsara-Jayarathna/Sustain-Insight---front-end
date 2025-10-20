import React from "react";

type Props = { sources?: string[] };

const ArticleSource: React.FC<Props> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return <span className="sr-only">Source unavailable</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {sources.slice(0, 2).map((source, idx) => (
        <span
          key={`${source}-${idx}`}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-800"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {source}
        </span>
      ))}
    </div>
  );
};

export default ArticleSource;
