import { useEffect, useState } from "react";
import ArticleGrid from "../articles/ArticleGrid";
import SearchBar from "../common/SearchBar";
import FilterModal from "../feedback/FilterModal";
import ActiveFilters from "../feedback/ActiveFilters";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { apiFetch } from "../../utils/api";
import { useAuthContext } from "../../context/AuthContext";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Popular", value: "popular" },
];

const ChevronDown = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function AllNewsView() {
  const { isAuthenticated } = useAuthContext();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isUserAction, setIsUserAction] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

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
        params.append("sort", sort);
        params.append("page", currentPage.toString());

        const baseUrl = isAuthenticated
          ? "/api/articles/all"
          : "/api/public/articles/all";

        const data = await apiFetch(`${baseUrl}?${params.toString()}`);
        setArticles(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
        setIsUserAction(false);
        setLoadingMessage(undefined);
      }
    }
    fetchArticles();
  }, [filters, sort, currentPage, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".sort-dropdown")) setSortOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value.trim() !== "")
  );

  return (
    <section className="px-2 sm:px-4 md:px-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <SearchBar
          onSearch={(kw) => {
            setFilters({ ...filters, keyword: kw });
            setCurrentPage(1);
            setIsUserAction(true);
            setLoadingMessage("Searching articles...");
          }}
        />

        <div className="flex items-center gap-2 justify-end">
          <div className="relative sort-dropdown">
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="relative flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 rounded-md text-sm text-gray-700 hover:border-gray-400"
            >
              {SORT_OPTIONS.find((opt) => opt.value === sort)?.label ??
                "Newest First"}
              <ChevronDown
                className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
              {sort !== "newest" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-md z-30">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSort(option.value);
                      setSortOpen(false);
                      setCurrentPage(1);
                      setIsUserAction(true);
                      setLoadingMessage("Sorting articles...");
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      option.value === sort
                        ? "font-semibold text-gray-900 bg-gray-50"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setFilterModalOpen(true)}
            className="relative px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white"
          >
            Filters
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      <ActiveFilters
        filters={filters}
        onRemove={(key) => {
          const updated = { ...filters };
          delete updated[key];
          if (key === "categoryIds") delete updated.categoryNames;
          if (key === "sourceIds") delete updated.sourceNames;
          setFilters(updated);
          setCurrentPage(1);
          setIsUserAction(true);
          setLoadingMessage(key === "keyword" ? "Clearing search..." : "Removing filter...");
        }}
      />

      {loading ? (
        <LoadingPlaceholder type="articles" mode={isUserAction ? "blocking" : "skeleton"} message={loadingMessage} />
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
        <div className="text-center text-gray-500 mt-8 p-6 bg-white rounded-lg shadow-sm">
          <p className="text-lg font-semibold mb-2">No articles found.</p>
          <p className="mb-4">Try broadening your search, adjusting your filters, or exploring different categories.</p>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Adjust Filters
          </button>
        </div>
      )}

      <FilterModal
  open={filterModalOpen}
  onClose={() => setFilterModalOpen(false)}
  activeFilters={filters}  
  onApply={(f) => {
    setFilters({
      ...filters,
      categoryIds: f.categoryIds,
      categoryNames: f.categoryNames,
      sourceIds: f.sourceIds,
      sourceNames: f.sourceNames,
      date: f.date,
    });
    setCurrentPage(1);
    setIsUserAction(true);
    setLoadingMessage("Applying filters...");
  }}
  onClear={() => {
    setFilters({});
    setCurrentPage(1);
    setIsUserAction(true);
    setLoadingMessage("Clearing filters...");
  }}
/>

    </section>
  );
}
