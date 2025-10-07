import React from "react";

const LeafIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w.3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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
  const containerClasses = "relative aspect-[16/9] w-full overflow-hidden rounded-t-lg";

  return (
    <div className={containerClasses}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-200">
          <LeafIcon className="h-12 w-12 text-emerald-400 opacity-70" />
        </div>
      )}
    </div>
  );
};

export default ArticleThumbnail;