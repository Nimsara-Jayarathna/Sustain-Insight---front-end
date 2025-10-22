import { useEffect, useState } from "react";
import ArticleGrid from "../articles/ArticleGrid";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { apiFetch } from "../../utils/api";

// --- New Props for Parent Communication ---
type Props = {
  onNavigate: (view: 'for-you' | 'all-news' | 'bookmarks') => void;
  onManagePreferences: () => void;
};

export default function ForYouView({ onNavigate, onManagePreferences }: Props) {
  // --- All State and Logic is Preserved ---
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchForYouArticles() {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/articles/feed?page=${currentPage}`;
        const data = await apiFetch(url);
        setRecentArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("DEBUG → Failed to fetch For You articles:", err);
        setError("Failed to load your personalized articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchForYouArticles();
  }, [currentPage]);
  // --- End of Preserved Logic ---

  const renderContent = () => {
    if (loading) {
      return <LoadingPlaceholder type="foryou" mode="skeleton" />;
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center text-gray-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-red-400 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">Something Went Wrong</h3>
          <p className="mx-auto max-w-md text-red-700 dark:text-red-200/80">{error}</p>
        </div>
      );
    }

    if (recentArticles.length > 0) {
      return (
        <>
          <ArticleGrid articles={recentArticles} variant="dashboard" />
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      );
    }

    // --- Redesigned "All Caught Up" Empty State ---
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-emerald-500 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-slate-100">You're All Caught Up!</h3>
        <p className="mx-auto mb-6 max-w-md">
          There are no new articles based on your preferences right now. You can manage your preferences or explore all news.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onManagePreferences}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Manage Preferences
          </button>
          <button
            onClick={() => onNavigate('all-news')}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
          >
            Explore All News
          </button>
        </div>
      </div>
    );
  };

  return <section className="space-y-6">{renderContent()}</section>;
};
