import React, { useState } from "react";
import ArticleModal from "./ArticleModal";
import ActionModal from "../feedback/ActionModal";

import { addBookmark, removeBookmark } from "../../api/bookmarks";
import { addInsight, removeInsight } from "../../api/insights";

import ArticleThumbnail from "./ArticleThumbnail";
import ArticleSource from "./ArticleSource";
import ArticleSummary from "./ArticleSummary";
import ArticleTitle from "./ArticleTitle";
import ArticleCategories from "./ArticleCategories";
import ArticleFooter from "./ArticleFooter";

type ArticleCardProps = {
  article: {
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
  variant?: "landing" | "dashboard";
  disablePopup?: boolean;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = "dashboard",
  disablePopup = false,
}) => {
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

  const toggleBookmark = async () => {
    if (modal.open) return;
    setModal({
      open: true,
      action: "bookmark",
      type: "loading",
      message: "Updating bookmark...",
    });

    try {
      if (bookmark) {
        await removeBookmark(article.id);
        setBookmark(false);
        setModal({
          open: true,
          action: "bookmark",
          type: "success",
          message: "Bookmark removed!",
        });
      } else {
        await addBookmark(article.id);
        setBookmark(true);
        setModal({
          open: true,
          action: "bookmark",
          type: "success",
          message: "Article bookmarked!",
        });
      }
    } catch {
      setModal({
        open: true,
        action: "bookmark",
        type: "error",
        message: "Failed to update bookmark",
      });
    }
  };

  const toggleInsight = async () => {
    if (modal.open) return;
    setModal({
      open: true,
      action: "insight",
      type: "loading",
      message: "Updating insight...",
    });

    try {
      if (insight) {
        await removeInsight(article.id);
        setInsight(false);
        setInsightCount((c) => Math.max(0, c - 1));
        setModal({
          open: true,
          action: "insight",
          type: "success",
          message: "Insight removed!",
        });
      } else {
        await addInsight(article.id);
        setInsight(true);
        setInsightCount((c) => c + 1);
        setModal({
          open: true,
          action: "insight",
          type: "success",
          message: "Insight added!",
        });
      }
    } catch {
      setModal({
        open: true,
        action: "insight",
        type: "error",
        message: "Failed to update insight",
      });
    }
  };

  const allowActions = variant === "dashboard";

  return (
    <>
      <article
        onClick={() => {
          if (!disablePopup) setOpen(true);
        }}
        className={`group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 ${
          disablePopup ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <ArticleThumbnail imageUrl={article.imageUrl} title={article.title} />
        <div className="flex flex-1 flex-col p-5">
          <ArticleSource sources={article.sources} />
          <ArticleTitle title={article.title} />
          <ArticleSummary summary={article.summary} variant={variant} />
          <ArticleCategories
            articleId={article.id}
            categories={article.categories}
          />
          <div className="flex-grow" />
          <ArticleFooter
            publishedAt={article.publishedAt}
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
          article={article}
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
