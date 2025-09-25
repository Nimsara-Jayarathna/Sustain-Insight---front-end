import React, { useEffect, useState } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Categories */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                  className="h-4 w-4 text-green-600"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Sources</h3>
          <div className="grid grid-cols-2 gap-2">
            {sources.map((s) => (
              <label key={s.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSources.includes(s.id)}
                  onChange={() => toggleSource(s.id)}
                  className="h-4 w-4 text-green-600"
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        {/* Single Date */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Date</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedSources([]);
              setDate("");
              onClear();
            }}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
