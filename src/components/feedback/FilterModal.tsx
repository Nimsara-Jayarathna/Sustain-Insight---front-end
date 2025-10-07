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
  // --- All State and Logic is Preserved ---
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [loadingData, setLoadingData] = useState(true);

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
        console.error("DEBUG → Failed to fetch filters:", err);
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
    const selectedCategoryNames = categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name);
    const selectedSourceNames = sources.filter((s) => selectedSources.includes(s.id)).map((s) => s.name);
    onApply({ categoryIds: selectedCategories, categoryNames: selectedCategoryNames, sourceIds: selectedSources, sourceNames: selectedSourceNames, date });
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

  const filteredSources = sources.filter((s) => s.name.toLowerCase().includes(searchSource.toLowerCase()));
  const selectAllSources = () => setSelectedSources(sources.map((s) => s.id));
  const deselectAllSources = () => setSelectedSources([]);
  const selectAllCategories = () => setSelectedCategories(categories.map((c) => c.id));
  const deselectAllCategories = () => setSelectedCategories([]);
  // --- End of Preserved Logic ---

  // --- Start of Redesigned JSX ---
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex flex-col w-full max-w-xl bg-white shadow-xl rounded-2xl max-h-[90vh] overflow-hidden">
        {/* --- Redesigned Header --- */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Filter Articles</h2>
          <button aria-label="Close" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100">×</button>
        </div>

        {/* --- Scrollable Content Area --- */}
        <div className="flex-grow p-6 overflow-y-auto">
          {loadingData ? (
            <div className="text-center py-10">
              <svg className="w-8 h-8 mx-auto mb-3 text-emerald-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-sm text-gray-600">Loading filter options...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-800">Categories</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={selectAllCategories} disabled={loadingData} className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50">Select All</button>
                    <button onClick={deselectAllCategories} disabled={loadingData} className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50">Clear</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map((c) => (
                    <button key={c.id} type="button" onClick={() => toggleCategory(c.id)} disabled={loadingData} className={`flex items-center justify-between px-3 py-2 text-left border rounded-lg transition-all duration-200 ${selectedCategories.includes(c.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-50`}><span className="text-sm font-medium truncate">{c.name}</span>{selectedCategories.includes(c.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}</button>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-800">Sources</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={selectAllSources} disabled={loadingData} className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50">Select All</button>
                    <button onClick={deselectAllSources} disabled={loadingData} className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50">Clear</button>
                  </div>
                </div>
                <div className="relative mb-3">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                  <input type="text" placeholder="Search sources..." value={searchSource} onChange={(e) => setSearchSource(e.target.value)} disabled={loadingData} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50" />
                </div>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                  {filteredSources.map((s) => (<button key={s.id} type="button" onClick={() => toggleSource(s.id)} disabled={loadingData} className={`w-full flex items-center justify-between px-3 py-2 text-left border rounded-lg transition-all duration-200 ${selectedSources.includes(s.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-50`}><span className="text-sm font-medium truncate">{s.name}</span>{selectedSources.includes(s.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}</button>))}
                  {filteredSources.length === 0 && (<p className="text-sm text-center text-gray-500 py-4">No sources found.</p>)}
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Date</h3>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={loadingData} className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Redesigned Footer --- */}
        <div className="flex items-center justify-between flex-shrink-0 gap-3 p-4 bg-white border-t border-gray-200">
          <button onClick={handleClear} disabled={loadingData} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50">
            Clear All
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} disabled={loadingData} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleApply} disabled={loadingData} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}