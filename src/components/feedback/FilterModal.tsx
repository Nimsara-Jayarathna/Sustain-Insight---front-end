import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    categoryIds: number[];
    sourceIds: number[];
    date?: string;
  }) => void;
  onClear: () => void;
};

export default function FilterModal({ open, onClose, onApply, onClear }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [searchSource, setSearchSource] = useState("");

  useEffect(() => {
    if (!open) return;
    async function fetchData() {
      try {
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setCategories(cats);
        setSources(srcs);
      } catch (err) {
        console.error("DEBUG → Failed to fetch filters:", err);
      }
    }
    fetchData();
  }, [open]);

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
    onApply({ categoryIds: selectedCategories, sourceIds: selectedSources, date });
    onClose();
  };

  if (!open) return null;

  // 🔍 Filter sources by search
  const filteredSources = sources.filter((s) =>
    s.name.toLowerCase().includes(searchSource.toLowerCase())
  );

  // 🔹 Bulk actions
  const selectAllSources = () => setSelectedSources(sources.map((s) => s.id));
  const deselectAllSources = () => setSelectedSources([]);
  const selectAllCategories = () => setSelectedCategories(categories.map((c) => c.id));
  const deselectAllCategories = () => setSelectedCategories([]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-200/60">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Categories</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAllCategories}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllCategories}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Deselect
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  title={c.name}
                  onClick={() => toggleCategory(c.id)}
                  className={`px-3 py-2 rounded-lg text-sm truncate transition ${
                    selectedCategories.includes(c.id)
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
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
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllSources}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Deselect
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search sources..."
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value)}
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />

            {/* Scrollable source list */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
              {filteredSources.map((s) => (
                <button
                  key={s.id}
                  title={s.name}
                  onClick={() => toggleSource(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition ${
                    selectedSources.includes(s.id)
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
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
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-5 border-t border-gray-200/60 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedSources([]);
              setDate("");
              onClear();
            }}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
