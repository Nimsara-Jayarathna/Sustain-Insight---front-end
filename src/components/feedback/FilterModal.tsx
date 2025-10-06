import { useEffect, useState } from "react";
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
  // ✅ Add currently active filters for sync
  activeFilters?: {
    categoryIds?: number[];
    sourceIds?: number[];
    date?: string;
  };
};

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
  const [loadingData, setLoadingData] = useState(true); // New loading state

  // 🔹 Fetch categories and sources once
  useEffect(() => {
    if (!open) return;
    async function fetchData() {
      try {
        setLoadingData(true); // Set loading to true
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setCategories(cats);
        setSources(srcs);
      } catch (err) {
        console.error("DEBUG → Failed to fetch filters:", err);
      } finally {
        setLoadingData(false); // Set loading to false
      }
    }
    fetchData();
  }, [open]);

  // ✅ Sync modal selections with parent filters whenever modal opens
  useEffect(() => {
    if (open) {
      setSelectedCategories(activeFilters.categoryIds || []);
      setSelectedSources(activeFilters.sourceIds || []);
      setDate(activeFilters.date || "");
      setSearchSource("");
    }
  }, [open, activeFilters]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSource = (id: number) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
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

  if (!open) return null;

  const filteredSources = sources.filter((s) =>
    s.name.toLowerCase().includes(searchSource.toLowerCase())
  );

  const selectAllSources = () => setSelectedSources(sources.map((s) => s.id));
  const deselectAllSources = () => setSelectedSources([]);
  const selectAllCategories = () =>
    setSelectedCategories(categories.map((c) => c.id));
  const deselectAllCategories = () => setSelectedCategories([]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-200/60">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loadingData ? (
            <div className="text-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-emerald-600 mx-auto mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-sm text-gray-600">Loading filter options...</p>
            </div>
          ) : (
            <>
              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllCategories}
                      disabled={loadingData}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllCategories}
                      disabled={loadingData}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      title={c.name}
                      onClick={() => toggleCategory(c.id)}
                      disabled={loadingData}
                      className={`px-3 py-2 rounded-lg text-sm truncate transition ${
                        selectedCategories.includes(c.id)
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Sources</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllSources}
                      disabled={loadingData}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllSources}
                      disabled={loadingData}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deselect
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Search sources..."
                  value={searchSource}
                  onChange={(e) => setSearchSource(e.target.value)}
                  disabled={loadingData}
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />

                <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
                  {filteredSources.map((s) => (
                    <button
                      key={s.id}
                      title={s.name}
                      onClick={() => toggleSource(s.id)}
                      disabled={loadingData}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition ${
                        selectedSources.includes(s.id)
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {s.name}
                    </button>
                  ))}
                  {filteredSources.length === 0 && (
                    <p className="text-sm text-gray-500">No sources found</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Date</h3>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={loadingData}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between p-5 border-t border-gray-200/60 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedSources([]);
              setDate("");
              onClear();
              onClose(); // Close the modal after clearing
            }}
            disabled={loadingData}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loadingData}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={loadingData}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
