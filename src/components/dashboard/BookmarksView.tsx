import ArticleGrid from "../articles/ArticleGrid";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { useSavedArticles } from "../../hooks/useSavedArticles";

// --- New Prop Type ---
type Props = {
  onNavigate: (view: 'for-you' | 'all-news' | 'bookmarks') => void;
};

export default function BookmarksView({ onNavigate }: Props) {
  const { articles, loading, error, page, pageSize, total, setPage } = useSavedArticles();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const renderContent = () => {
    if (loading) {
      return <LoadingPlaceholder type="bookmarks" mode="blocking" />;
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

    if (articles.length > 0) {
      return (
        <>
          <ArticleGrid articles={articles} variant="dashboard" />
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      );
    }

    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-slate-100">No Bookmarks Yet</h3>
        <p className="mx-auto mb-5 max-w-md">
          Click the bookmark icon on any article to save it here for later.
        </p>
        {/* --- THE FIX IS HERE: This is now a button that uses the onNavigate prop --- */}
        <button
          onClick={() => onNavigate('all-news')}
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          Explore News
        </button>
      </div>
    );
  };

  return <section className="space-y-6">{renderContent()}</section>;
}
