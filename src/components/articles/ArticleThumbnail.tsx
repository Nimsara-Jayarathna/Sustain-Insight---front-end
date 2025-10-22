import React from "react";

const LeafIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h4l2-3 2 3h4a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7Z" />
    <path d="M12 18A3 3 0 0 0 9 15" />
  </svg>
);

// The `variant` prop is no longer needed.
type Props = { 
  imageUrl?: string; 
  title: string;
};

const ArticleThumbnail: React.FC<Props> = ({ imageUrl, title }) => {
  // The container classes are now simple, consistent, and non-conditional.
  const containerClasses = "relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-slate-800";

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10" />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-500/10 dark:to-cyan-500/10">
          <LeafIcon className="h-12 w-12 text-emerald-400 opacity-70 transition-transform duration-700 group-hover:scale-110 dark:text-emerald-300" />
        </div>
      )}
      <div className="absolute inset-x-4 bottom-4 z-20 flex translate-y-3 items-center justify-between text-xs font-medium text-white/90 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="rounded-full bg-black/45 px-3 py-1 backdrop-blur">
          Sustainability brief
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-lg">
          Read Article
        </span>
      </div>
    </div>
  );
};

export default ArticleThumbnail;
