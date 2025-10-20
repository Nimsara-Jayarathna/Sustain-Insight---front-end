import { useEffect, useState } from "react";
// Remove Link, as we are now using a button with a callback
import ArticleGrid from "../articles/ArticleGrid";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { apiFetch } from "../../utils/api";

// --- New Prop Type ---
type Props = {
  onNavigate: (view: 'for-you' | 'all-news' | 'bookmarks') => void;
};

export default function BookmarksView({ onNavigate }: Props) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/bookmarks?page=${currentPage}`;
        const data = await apiFetch(url);
        setArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
        if (data.currentPage) {
          setCurrentPage(data.currentPage);
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load your bookmarks. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, [currentPage]);

  const renderContent = () => {
    if (loading) {
      return <LoadingPlaceholder type="bookmarks" mode="blocking" />;
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center text-gray-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <h3 className="text-lg font-semibold text-red-800 mb-2">Something Went Wrong</h3>
           <p className="max-w-md mx-auto text-red-700">{error}</p>
        </div>
      );
    }

    if (articles.length > 0) {
      return (
        <>
          <ArticleGrid articles={articles} variant="dashboard" />
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

    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bookmarks Yet</h3>
        <p className="max-w-md mx-auto mb-5">
          Click the bookmark icon on any article to save it here for later.
        </p>
        {/* --- THE FIX IS HERE: This is now a button that uses the onNavigate prop --- */}
        <button
          onClick={() => onNavigate('all-news')}
          className="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition"
        >
          Explore News
        </button>
      </div>
    );
  };

  return <section className="space-y-6">{renderContent()}</section>;
}
