import { useEffect, useState } from "react";
import ArticleGrid from "../common/ArticleGrid";
import SearchBar from "../common/SearchBar";
import FilterModal from "../common/FilterModal";
import ActiveFilters from "../common/ActiveFilters";
import { apiFetch } from "../../utils/api";

export default function AllNewsView() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // 🔹 Fetch articles when filters change
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
        if (filters.date) params.append("date", filters.date); // ✅ single date filter

        // ✅ only relative path — apiFetch will add backendURL
        const url = `/api/public/articles/all?${params.toString()}`;
        const data = await apiFetch(url);
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [filters]);

  return (
    <section>
      {/* 🔍 Search + Filters button */}
      <div className="flex items-center justify-between mb-4">
        <SearchBar onSearch={(kw) => setFilters({ ...filters, keyword: kw })} />
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
          if (key === "date") {
            delete updated.date; // ✅ corrected
          } else {
            delete updated[key];
          }
          setFilters(updated);
        }}
      />

      {/* 📄 Articles */}
      {loading ? (
        <p className="text-center text-gray-600">Loading articles...</p>
      ) : (
       
      <ArticleGrid articles={articles} variant="dashboard" />
      )}

      {/* 📌 Filter modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(f) => setFilters({ ...filters, ...f })}
        onClear={() => setFilters({})}
      />
    </section>
  );
}
