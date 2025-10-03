import { useEffect, useState } from "react";
import ArticleGrid from "../common/ArticleGrid";
import Pagination from "./Pagination"; // ✅ reuse pagination
import { apiFetch } from "../../utils/api";

const BookmarksView = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        setLoading(true);
        setError(null);

        // ✅ Replace with real API endpoint
        const url = `/api/bookmarks?page=${currentPage}&size=10`;
        const data = await apiFetch(url);

        // ⚠️ Expecting backend pagination response
        setBookmarkedArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [currentPage]);

  return (
    <section>
      {/* 🔍 Search (frontend filter only for now) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <input
          type="search"
          placeholder="Search your bookmarks..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading bookmarks...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-8">{error}</p>
      ) : bookmarkedArticles.length > 0 ? (
        <>
          <ArticleGrid articles={bookmarkedArticles} variant="dashboard" />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          You don’t have any saved bookmarks yet.
        </p>
      )}
    </section>
  );
};

export default BookmarksView;
