// src/components/dashboard/BookmarksView.tsx
import { useEffect, useState } from "react";
import ArticleGrid from "../articles/ArticleGrid";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
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
      {loading ? (
        <LoadingPlaceholder type="bookmarks" mode="blocking" />
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
