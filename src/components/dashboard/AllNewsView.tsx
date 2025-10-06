import { useEffect, useState } from "react";
import ArticleGrid from "../articles/ArticleGrid";
import SearchBar from "../common/SearchBar";
import FilterModal from "../feedback/FilterModal";
import ActiveFilters from "../feedback/ActiveFilters";
import Pagination from "./Pagination";
import LoadingPlaceholder from "../ui/LoadingPlaceholder";
import { apiFetch } from "../../utils/api";
import { useAuthContext } from "../../context/AuthContext";

// --- UI Helper Components (can be moved to a separate file if desired) ---
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Popular", value: "popular" },
];

const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;
const ChevronDown = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;

export default function AllNewsView() {
  // --- All State and Logic is Preserved ---
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
        if (filters.categoryIds?.length) params.append("category", filters.categoryIds.join(","));
        if (filters.sourceIds?.length) params.append("source", filters.sourceIds.join(","));
        if (filters.date) params.append("date", filters.date);
        params.append("sort", sort);
        params.append("page", currentPage.toString());
        const baseUrl = isAuthenticated ? "/api/articles/all" : "/api/public/articles/all";
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
    (value) => (Array.isArray(value) && value.length > 0) || (typeof value === "string" && value.trim() !== "")
  );
  // --- End of Preserved Logic ---

  // --- Start of Redesigned JSX ---
  return (
    <section className="px-2 sm:px-4 md:px-6">
      {/* --- Redesigned Header Row --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex-grow sm:max-w-xs">
          <SearchBar
            onSearch={(kw) => {
              setFilters({ ...filters, keyword: kw });
              setCurrentPage(1);
              setIsUserAction(true);
              setLoadingMessage("Searching articles...");
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          {/* Sort Dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <SortIcon />
              <span>{SORT_OPTIONS.find((opt) => opt.value === sort)?.label ?? "Sort"}</span>
              <ChevronDown className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-30 p-1">
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                      option.value === sort ? "font-semibold text-emerald-600" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="relative flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <FilterIcon />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
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
        onClearAll={() => {
          setFilters({});
          setCurrentPage(1);
          setIsUserAction(true);
          setLoadingMessage("Clearing all filters...");
        }}
      />

      {loading ? (
        <LoadingPlaceholder type="articles" mode={isUserAction ? "blocking" : "skeleton"} message={loadingMessage} />
      ) : articles.length > 0 ? (
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
      ) : (
        // --- Redesigned "No Articles Found" State ---
        <div className="text-center text-gray-600 mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Articles Found</h3>
          <p className="max-w-md mx-auto mb-5">Your current search and filter combination didn't return any results. Try a different search or adjust your filters.</p>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition"
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