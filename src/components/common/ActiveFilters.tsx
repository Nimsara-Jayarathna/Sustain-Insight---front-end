import React from "react";

type Props = {
  filters: {
    keyword?: string;
    categoryIds?: number[];
    sourceIds?: number[];
    from?: string;
    to?: string;
  };
  onRemove: (key: string, value?: any) => void;
};

export default function ActiveFilters({ filters, onRemove }: Props) {
  const chips: { label: string; key: string; value?: any }[] = [];

  if (filters.keyword) chips.push({ label: `Search: ${filters.keyword}`, key: "keyword" });
  if (filters.categoryIds?.length)
    chips.push({ label: `Categories: ${filters.categoryIds.length}`, key: "categoryIds" });
  if (filters.sourceIds?.length)
    chips.push({ label: `Sources: ${filters.sourceIds.length}`, key: "sourceIds" });
  if (filters.from && filters.to) chips.push({ label: `Date: ${filters.from} → ${filters.to}`, key: "date" });

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
        >
          {chip.label}
          <button onClick={() => onRemove(chip.key, chip.value)} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
