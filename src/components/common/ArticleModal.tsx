// src/components/common/ArticleModal.tsx

import { Article } from "./ArticleCard"; // Import the shared Article type

// --- INLINE SVG ICON ---
const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- TYPE DEFINITIONS ---
type ArticleModalProps = {
  article: Article | null; // The article can be null when the modal is closed
  onClose: () => void; // A function that takes no arguments and returns nothing
};

// --- ARTICLE MODAL COMPONENT ---
const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-300 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl animate-scaleUp"
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            {article.sources && (
              <span className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                {article.sources[0]}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <XIcon size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{article.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            Published on {article.publishedAt ? new Intl.DateTimeFormat("en-US", { dateStyle: 'full' }).format(new Date(article.publishedAt)) : "an unknown date"}
          </p>

          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="w-full rounded-lg mb-8" />
          )}

          <div className="prose lg:prose-lg max-w-none font-serif text-gray-800">
            <p>{article.summary || "No summary was provided for this article."}</p>
            {/* You can add full article content here if available */}
          </div>
        </div>

        <footer className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex flex-wrap gap-2">
            {article.categories?.map((category: string) => ( // Explicitly typed 'category'
              <span key={category} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {category}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArticleModal;