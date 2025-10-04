import React from "react";

type Props = { sources?: string[] };

const ArticleSource: React.FC<Props> = ({ sources }) => (
  <div className="mb-3 min-h-[24px] flex items-center">
    {sources && sources.length > 0 ? (
      <p className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white w-fit">
        From {sources[0]}
      </p>
    ) : (
      <span className="opacity-0">placeholder</span>
    )}
  </div>
);

export default ArticleSource;
