import { useEffect, useState } from "react";
import ArticleGrid from "../common/ArticleGrid";
import SearchBar from "../common/SearchBar";
import FilterModal from "../common/FilterModal";
import ActiveFilters from "../common/ActiveFilters";
import Pagination from "./Pagination";  // ✅ import pagination
import { apiFetch } from "../../utils/api";

export default function AllNewsView() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch articles when filters or page changes
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (filters.keyword) params.append("search", filters.keyword);
        if (filters.categoryIds?.length)
          params.append("category", filters.categoryIds.join(","));
        if (filters.sourceIds?.length)
          params.append("source", filters.sourceIds.join(","));
        if (filters.date) params.append("date", filters.date);

        params.append("page", currentPage.toString()); // ✅ pagination
        params.append("size", "10"); // ✅ backend page size

        const url = `/api/public/articles/all?${params.toString()}`;
        const data = await apiFetch(url);

        // ⚠️ Expecting { content, totalPages }
        setArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [filters, currentPage]);

  return (
    <section>
      {/* 🔍 Search + Filters button */}
      <div className="flex items-center justify-between mb-4">
        <SearchBar onSearch={(kw) => {
          setFilters({ ...filters, keyword: kw });
          setCurrentPage(1); // reset to first page when searching
        }} />
        <button
          onClick={() => setFilterModalOpen(true)}
          className="ml-4 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Filters
        </button>
      </div>

      {/* 🎯 Active filters as chips */}
      <ActiveFilters
        filters={filters}
        onRemove={(key) => {
          const updated = { ...filters };
          delete updated[key];
          setFilters(updated);
          setCurrentPage(1); // reset page when filters change
        }}
      />

      {/* 📄 Articles */}
      {loading ? (
        <p className="text-center text-gray-600">Loading articles...</p>
      ) : articles.length > 0 ? (
        <>
          <ArticleGrid articles={articles} variant="dashboard" />
          {/* ✅ Show pagination only when results exist */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No articles found. Try adjusting your filters.
        </p>
      )}

      {/* 📌 Filter modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(f) => {
          setFilters({ ...filters, ...f });
          setCurrentPage(1); // reset when filters applied
        }}
        onClear={() => {
          setFilters({});
          setCurrentPage(1); // reset when cleared
        }}
      />
    </section>
  );
}
