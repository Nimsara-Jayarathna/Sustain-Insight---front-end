import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";
import ArticleThumbnail from "./ArticleThumbnail";
import ArticleSource from "./ArticleSource";
import ArticleCategories from "./ArticleCategories";
import ArticleFooter from "./ArticleFooter";

// ✅ --- NEW HELPER FUNCTION ---
// This function takes a long string and formats it into paragraphs.
const formatContentIntoParagraphs = (text: string | null): string[] => {
  if (!text) return [];

  // 1. Split the text into sentences. This regex looks for periods,
  // question marks, or exclamation marks followed by a space or end of string.
  const sentences = text.match(/[^.!?]+[.!?]\s*/g) || [text];

  // 2. Group sentences into paragraphs of 2-3 sentences each.
  const paragraphs: string[] = [];
  let currentParagraph = "";
  for (let i = 0; i < sentences.length; i++) {
    currentParagraph += sentences[i];
    // Group 2 sentences, but if it's the last group, include up to 3.
    if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = "";
    }
  }
  return paragraphs.filter(p => p.length > 0);
};


type ArticleModalProps = {
  article: {
    id: number | string;
    title: string;
    summary?: string;
    content?: string;
    imageUrl?: string;
    publishedAt?: string;
    sources?: string[];
    categories?: string[];
  };
  bookmark: boolean;
  insight: boolean;
  insightCount: number;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onToggleInsight: (e: React.MouseEvent) => void;
  onClose: () => void;
  allowActions?: boolean;
};

const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  bookmark,
  insight,
  insightCount,
  onToggleBookmark,
  onToggleInsight,
  onClose,
  allowActions = true,
}) => {
  const [rawContent, setRawContent] = useState<string | null>(article.content || null);
  const [loading, setLoading] = useState(!article.content);
  const [show, setShow] = useState(false);
  
  // ✅ Use useMemo to format the content only when it changes.
  const formattedParagraphs = useMemo(() => formatContentIntoParagraphs(rawContent), [rawContent]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    requestAnimationFrame(() => setShow(true));
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!article.id || article.content) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiFetch(`/api/articles/${article.id}/content`)
      .then((data) => {
        setRawContent(data.content || "This article seems to be empty.");
      })
      .catch((err) => {
        console.error("Failed to load article content:", err);
        setRawContent("Unable to load content at this time. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [article.id, article.content]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center p-2 sm:p-4 transition-opacity duration-300 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={handleClose}
    >
      <div
        className={`flex flex-col w-full max-w-3xl bg-white shadow-xl rounded-2xl h-full max-h-[95vh] overflow-hidden transition-all duration-300 ease-in-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex items-start justify-between flex-shrink-0 p-4 border-b border-gray-200 sm:p-5">
          <h2 className="flex-grow text-lg font-bold text-gray-900 sm:text-xl pr-4">
            {article.title}
          </h2>
          <button
            aria-label="Close"
            onClick={handleClose}
            className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="flex-grow p-4 sm:p-5 overflow-y-auto">
          {article.imageUrl && (
            <div className="mb-4">
              <ArticleThumbnail imageUrl={article.imageUrl} title={article.title} />
            </div>
          )}

          <div className="mb-4">
            <ArticleSource sources={article.sources} />
          </div>

          <div className="mt-4 text-gray-800">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-10 h-10 text-emerald-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-base font-medium text-gray-700">Loading full article...</p>
              </div>
            )}
            
            {/* ✅ --- NEW: ENHANCED CONTENT RENDERING --- */}
            {!loading && formattedParagraphs.length > 0 && (
              <div className="prose prose-lg max-w-none prose-p:leading-relaxed prose-p:text-gray-800">
                {formattedParagraphs.map((p, i) => (
                  <p 
                    key={i} 
                    // Apply the drop cap style only to the very first paragraph
                    className={i === 0 
                      ? "first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left" 
                      : ""}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- Categories & Actions Footers --- */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 sm:p-5 bg-gray-50">
          <ArticleCategories articleId={article.id} categories={article.categories} />
        </div>
        {allowActions && (
          <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 sm:p-5">
            <ArticleFooter
              publishedAt={article.publishedAt}
              allowActions={true}
              bookmark={bookmark}
              insight={insight}
              insightCount={insightCount}
              onToggleBookmark={onToggleBookmark}
              onToggleInsight={onToggleInsight}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleModal;