import React from 'react';

// Define types for clarity
interface Item { 
  id: number; // CHANGED: from string | number to just number
  name: string; 
}

interface PreferencesTabProps {
  categories: Item[];
  selectedCategories: number[]; // CHANGED: from (string | number)[] to number[]
  toggleCategory: (id: number) => void; // CHANGED: from (id: string | number) to (id: number)
  sources: Item[];
  selectedSources: number[]; // CHANGED: from (string | number)[] to number[]
  toggleSource: (id: number) => void; // CHANGED: from (id: string | number) to (id: number)
  saving: boolean;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  categories, selectedCategories, toggleCategory,
  sources, selectedSources, toggleSource,
  saving
}) => {
  return (
    <div className="space-y-8 text-gray-800 dark:text-slate-200">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">Preferred Categories</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <button key={c.id} type="button" onClick={() => toggleCategory(c.id)} disabled={saving} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-all duration-200 disabled:opacity-50 ${selectedCategories.includes(c.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200' : 'bg-white hover:bg-gray-50 border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200'}`}>
              <span className="text-sm font-medium truncate">{c.name}</span>
              {selectedCategories.includes(c.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">Preferred Sources</label>
        <div className="grid grid-cols-2 gap-3">
          {sources.map((s) => (
            <button key={s.id} type="button" onClick={() => toggleSource(s.id)} disabled={saving} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-all duration-200 disabled:opacity-50 ${selectedSources.includes(s.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200' : 'bg-white hover:bg-gray-50 border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200'}`}>
              <span className="text-sm font-medium truncate">{s.name}</span>
              {selectedSources.includes(s.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
