import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    categoryIds: number[];
    categoryNames: string[];
    sourceIds: number[];
    sourceNames: string[];
    date?: string;
  }) => void;
  onClear: () => void;
  activeFilters?: {
    categoryIds?: number[];
    sourceIds?: number[];
    date?: string;
  };
};

type TabConfig = {
  key: "categories" | "sources" | "date";
  label: string;
};

const TABS: TabConfig[] = [
  { key: "categories", label: "Categories" },
  { key: "sources", label: "Sources" },
  { key: "date", label: "Date" },
];

const DATE_PRESETS = [
  { label: "Today", offsetDays: 0 },
  { label: "Past 7 Days", offsetDays: 7 },
  { label: "Past 30 Days", offsetDays: 30 },
] as const;

const formatOffsetDate = (offset: number) =>
  new Date(Date.now() - offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default function FilterModal({
  open,
  onClose,
  onApply,
  onClear,
  activeFilters = {},
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<TabConfig["key"]>("categories");

  useEffect(() => {
    if (!open) return;
    async function fetchData() {
      try {
        setLoadingData(true);
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setCategories(cats);
        setSources(srcs);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelectedCategories(activeFilters.categoryIds || []);
      setSelectedSources(activeFilters.sourceIds || []);
      setDate(activeFilters.date || "");
      setSearchSource("");
      setActiveTab("categories");
    }
  }, [open, activeFilters]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const filteredSources = useMemo(
    () =>
      sources.filter((s) =>
        s.name.toLowerCase().includes(searchSource.toLowerCase()),
      ),
    [sources, searchSource],
  );

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleSource = (id: number) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    const selectedCategoryNames = categories
      .filter((c) => selectedCategories.includes(c.id))
      .map((c) => c.name);
    const selectedSourceNames = sources
      .filter((s) => selectedSources.includes(s.id))
      .map((s) => s.name);
    onApply({
      categoryIds: selectedCategories,
      categoryNames: selectedCategoryNames,
      sourceIds: selectedSources,
      sourceNames: selectedSourceNames,
      date,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedSources([]);
    setDate("");
    onClear();
    onClose();
  };

  if (!open) return null;

  const selectAllSources = () => setSelectedSources(sources.map((s) => s.id));
  const deselectAllSources = () => setSelectedSources([]);
  const selectAllCategories = () => setSelectedCategories(categories.map((c) => c.id));
  const deselectAllCategories = () => setSelectedCategories([]);

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {selectedCategories.length
            ? `${selectedCategories.length} selected`
            : "Choose the topics you want to follow"}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={selectAllCategories}
            disabled={loadingData}
            className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50"
          >
            Select All
          </button>
          <button
            onClick={deselectAllCategories}
            disabled={loadingData}
            className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map((c) => {
          const active = selectedCategories.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              disabled={loadingData}
              className={`flex items-center justify-between rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                  : "border border-gray-200 bg-white/90 text-gray-700 hover:border-emerald-300 hover:text-emerald-700"
              } disabled:opacity-50`}
            >
              <span className="truncate">{c.name}</span>
              {active && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSources = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {filteredSources.length} source{filteredSources.length === 1 ? "" : "s"} available
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={selectAllSources}
            disabled={loadingData}
            className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50"
          >
            Select All
          </button>
          <button
            onClick={deselectAllSources}
            disabled={loadingData}
            className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="-mx-6">
        <div className="sticky top-0 z-10 bg-white/95 px-6 pb-3 pt-2 backdrop-blur">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search sources..."
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value)}
              disabled={loadingData}
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50"
            />
          </div>
        </div>
        <div className="max-h-64 space-y-2 overflow-y-auto px-6 pb-1">
          {filteredSources.map((s) => {
            const active = selectedSources.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSource(s.id)}
                disabled={loadingData}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 text-white shadow"
                    : "border border-gray-200 bg-white/90 text-gray-700 hover:border-emerald-300 hover:text-emerald-700"
                } disabled:opacity-50`}
              >
                <span className="truncate">{s.name}</span>
                {active && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
          {!filteredSources.length && (
            <p className="py-6 text-center text-sm text-gray-500">No sources found.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderDate = () => (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Set a custom date or pick a quick preset to narrow your feed.
      </p>
      <div className="flex flex-wrap gap-2">
        {DATE_PRESETS.map((preset) => {
          const presetValue = formatOffsetDate(preset.offsetDays);
          const active = date === presetValue;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setDate(presetValue)}
              disabled={loadingData}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:text-emerald-700"
              } disabled:opacity-50`}
            >
              {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setDate("")}
          disabled={loadingData}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
        >
          Clear
        </button>
      </div>
      <div className="relative max-w-sm">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loadingData}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (loadingData) {
      return (
        <div className="py-10 text-center">
          <svg
            className="mx-auto mb-3 h-9 w-9 animate-spin text-emerald-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">Loading filter options...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "sources":
        return renderSources();
      case "date":
        return renderDate();
      case "categories":
      default:
        return renderCategories();
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-h-[90vh]">
        <header className="relative flex flex-col gap-4 bg-gradient-to-r from-emerald-600/95 to-cyan-500/95 px-6 py-5 text-white sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Filter Articles</h2>
              <p className="text-sm text-white/80">
                Tune your feed by category, source, or recency. Changes apply instantly across the dashboard.
              </p>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-white text-emerald-600 shadow-sm" : "text-white/80 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{renderTabContent()}</div>

        <footer className="flex flex-col gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end sm:gap-4 sm:px-8">
          <button
            onClick={handleClear}
            disabled={loadingData}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            disabled={loadingData}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={loadingData}
            className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
}
