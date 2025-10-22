// import React from "react";

type Props = {
  filters: {
    keyword?: string;
    categoryIds?: number[];
    sourceIds?: number[];
    categoryNames?: string[];
    sourceNames?: string[];
    date?: string;
  };
  onRemove: (key: string, value?: any) => void;
  onClearAll: () => void; // ✅ New prop for the "Clear All" button
};

export default function ActiveFilters({ filters, onRemove, onClearAll }: Props) {
  // --- All of the existing logic for building chips is preserved ---
  const chips: { label: string; key: string; value?: any }[] = [];

  if (filters.keyword) {
    chips.push({ label: `Search: "${filters.keyword}"`, key: "keyword" });
  }

  if (filters.categoryNames?.length) {
    chips.push({
      label:
        filters.categoryNames.length > 2
          ? `Categories: ${filters.categoryNames.slice(0, 2).join(", ")} +${filters.categoryNames.length - 2}`
          : `Categories: ${filters.categoryNames.join(", ")}`,
      key: "categoryIds",
    });
  }

  if (filters.sourceNames?.length) {
    chips.push({
      label:
        filters.sourceNames.length > 2
          ? `Sources: ${filters.sourceNames.slice(0, 2).join(", ")} +${filters.sourceNames.length - 2}`
          : `Sources: ${filters.sourceNames.join(", ")}`,
      key: "sourceIds",
    });
  }

  if (filters.date) {
    chips.push({ label: `Date: ${filters.date}`, key: "date" });
  }
  // --- End of preserved logic ---

  // If there are no filters, render nothing.
  if (chips.length === 0) {
    return null;
  }

  // --- Start of Redesigned JSX ---
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Active Filters:</h3>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-300"
          title="Clear all active filters"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
          >
            <span className="font-medium">{chip.label}</span>
            <button
              onClick={() => onRemove(chip.key, chip.value)}
              className="rounded-full p-0.5 text-emerald-600 transition-colors hover:bg-emerald-200 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
              title={`Remove ${chip.key} filter`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
