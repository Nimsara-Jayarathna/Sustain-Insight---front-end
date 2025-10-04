// src/components/dashboard/AllNewsView.tsx
import { useEffect, useState } from "react";
import ArticleGrid from "../articles/ArticleGrid";
import SearchBar from "../common/SearchBar";
import FilterModal from "../feedback/FilterModal";
import ActiveFilters from "../feedback/ActiveFilters";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { apiFetch } from "../../utils/api";
import { useAuthContext } from "../../context/AuthContext";

export default function AllNewsView() {
  const { isAuthenticated } = useAuthContext();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

        params.append("page", currentPage.toString());

        const baseUrl = isAuthenticated
          ? "/api/articles/all"
          : "/api/public/articles/all";

        const url = `${baseUrl}?${params.toString()}`;
        const data = await apiFetch(url);

        setArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [filters, currentPage, isAuthenticated]);

  return (
    <section className="px-2 sm:px-4 md:px-6">
      {/* Search + Filters Row (responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <SearchBar
          onSearch={(kw) => {
            setFilters({ ...filters, keyword: kw });
            setCurrentPage(1);
          }}
        />
        <button
          onClick={() => setFilterModalOpen(true)}
          className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white w-full sm:w-auto transition-colors"
        >
          Filters
        </button>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onRemove={(key) => {
          const updated = { ...filters };
          delete updated[key];
          setFilters(updated);
          setCurrentPage(1);
        }}
      />

      {/* Articles */}
      {loading ? (
  <LoadingPlaceholder type="articles" mode="skeleton" />
) : articles.length > 0 ? (
  <>
    <ArticleGrid articles={articles} variant="dashboard" />
    <div className="mt-6">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  </>
) : (
  <p className="text-center text-gray-500 mt-8">
    No articles found. Try adjusting your filters.
  </p>
)}


      {/* Filters Modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(f) => {
          setFilters({ ...filters, ...f });
          setCurrentPage(1);
        }}
        onClear={() => {
          setFilters({});
          setCurrentPage(1);
        }}
      />
    </section>
  );
}
