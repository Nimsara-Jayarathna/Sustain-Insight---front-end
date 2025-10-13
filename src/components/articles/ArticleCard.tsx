// src/components/articles/ArticleCard.tsx
import React, { useState, useCallback } from 'react';
import ArticleModal from "./ArticleModal";
import ActionModal from "../feedback/ActionModal";
import { apiFetch } from '../../utils/api'; // ✅ Import apiFetch
import { addBookmark, removeBookmark } from "../../api/bookmarks";
import { addInsight, removeInsight } from "../../api/insights";

import ArticleThumbnail from "./ArticleThumbnail";
import ArticleSource from "./ArticleSource";
import ArticleSummary from "./ArticleSummary";
import ArticleTitle from "./ArticleTitle";
import ArticleCategories from "./ArticleCategories";
import ArticleFooter from "./ArticleFooter";

type Article = {
  id: number | string;
  title: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  publishedAt?: string;
  sources?: string[];
  categories?: string[];
  bookmarked?: boolean;
  insighted?: boolean;
  insightCount?: number;
};

type ArticleCardProps = {
  article: Article;
  variant?: "landing" | "dashboard";
  disablePopup?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "dashboard",
  disablePopup = false,
}) => {
  // ✅ Store the full article object in state to allow for updates (like adding content)
  const [articleData, setArticleData] = useState<Article>(article);
  
  const [bookmark, setBookmark] = useState(article.bookmarked ?? false);
  const [insight, setInsight] = useState(article.insighted ?? false);
  const [insightCount, setInsightCount] = useState(article.insightCount ?? 0);
  const [open, setOpen] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    action: "bookmark" | "insight";
    type: "loading" | "success" | "error";
    message: string;
  }>({ open: false, action: "bookmark", type: "loading", message: "" });

  // ✅ New function to pre-fetch content on hover
  const prefetchContent = useCallback(async () => {
    // Only run if: it's the dashboard, we don't already have content, and there's an ID.
    if (variant === 'dashboard' && !articleData.content && articleData.id) {
      try {
        const data = await apiFetch(`/api/articles/${articleData.id}/content`);
        // Update the state with the new content so the modal can use it instantly
        setArticleData(prev => ({ ...prev, content: data.content || "" }));
      } catch (err) {
        // Fail silently. The modal's own fetcher will act as a fallback.
        console.error("Prefetch failed:", err);
      }
    }
  }, [variant, articleData.id, articleData.content]);


  // --- Action handlers (toggleBookmark, toggleInsight) remain unchanged ---
  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modal.open) return;
    setModal({ open: true, action: "bookmark", type: "loading", message: "Updating bookmark..." });
    try {
      if (bookmark) {
        await removeBookmark(articleData.id);
        setBookmark(false);
        setModal({ open: true, action: "bookmark", type: "success", message: "Bookmark removed!" });
      } else {
        await addBookmark(articleData.id);
        setBookmark(true);
        setModal({ open: true, action: "bookmark", type: "success", message: "Article bookmarked!" });
      }
    } catch {
      setModal({ open: true, action: "bookmark", type: "error", message: "Failed to update bookmark" });
    }
  };

  const toggleInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modal.open) return;
    setModal({ open: true, action: "insight", type: "loading", message: "Updating insight..." });
    try {
      if (insight) {
        await removeInsight(articleData.id);
        setInsight(false);
        setInsightCount((c) => Math.max(0, c - 1));
        setModal({ open: true, action: "insight", type: "success", message: "Insight removed!" });
      } else {
        await addInsight(articleData.id);
        setInsight(true);
        setInsightCount((c) => c + 1);
        setModal({ open: true, action: "insight", type: "success", message: "Insight added!" });
      }
    } catch {
      setModal({ open: true, action: "insight", type: "error", message: "Failed to update insight" });
    }
  };


  const allowActions = variant === "dashboard";
  const isLanding = variant === 'landing';

  const baseClasses = "group flex flex-col transition-all duration-300 ease-in-out h-full";
  const variantClasses = isLanding
    ? "rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 bg-white"
    : "rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1";
  const cursorClass = disablePopup ? "cursor-default" : "cursor-pointer";

  return (
    <>
      <article
        onClick={() => { if (!disablePopup) setOpen(true); }}
        onMouseEnter={prefetchContent} // ✅ Trigger pre-fetch on mouse hover
        className={`${baseClasses} ${variantClasses} ${cursorClass}`}
      >
        <ArticleThumbnail 
          imageUrl={articleData.imageUrl} 
          title={articleData.title} 
        />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <ArticleSource sources={articleData.sources} />
          <ArticleTitle title={articleData.title} />
          <ArticleSummary summary={articleData.summary} variant={variant} />
          
          <div className="flex-grow" /> 
          
          <ArticleCategories articleId={articleData.id} categories={articleData.categories} />
          
          <ArticleFooter
            publishedAt={articleData.publishedAt}
            allowActions={allowActions}
            bookmark={bookmark}
            insight={insight}
            insightCount={insightCount}
            onToggleBookmark={toggleBookmark}
            onToggleInsight={toggleInsight}
          />
        </div>
      </article>

      {open && (
        <ArticleModal
          article={articleData} // ✅ Pass the stateful articleData which may contain pre-fetched content
          bookmark={bookmark}
          insight={insight}
          insightCount={insightCount}
          onToggleBookmark={toggleBookmark}
          onToggleInsight={toggleInsight}
          onClose={() => setOpen(false)}
          allowActions={allowActions}
        />
      )}

      {modal.open && (
        <ActionModal
          action={modal.action}
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, open: false })}
        />
      )}
    </>
  );
};

export default ArticleCard;