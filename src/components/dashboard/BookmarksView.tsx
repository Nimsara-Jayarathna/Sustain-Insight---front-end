// src/components/dashboard/BookmarksView.tsx
import { useEffect, useState } from "react";
import ArticleGrid from "../common/ArticleGrid";
import Pagination from "./Pagination";
import { apiFetch } from "../../utils/api";

export default function BookmarksView() {
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

        // ✅ Only send current page (1-based), backend handles size/default
        const url = `/api/bookmarks?page=${currentPage}`;
        const data = await apiFetch(url);

        setArticles(data.content || []);
        setTotalPages(data.totalPages || 1);

        // ✅ ensure FE currentPage matches BE's response
        if (data.currentPage) {
          setCurrentPage(data.currentPage);
        }
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
      ) : articles.length > 0 ? (
        <>
          <ArticleGrid articles={articles} variant="dashboard" />
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
}
