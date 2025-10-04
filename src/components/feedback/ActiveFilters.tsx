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
};

export default function ActiveFilters({ filters, onRemove }: Props) {
  const chips: { label: string; key: string; value?: any }[] = [];

  if (filters.keyword)
    chips.push({ label: `Search: ${filters.keyword}`, key: "keyword" });

  if (filters.categoryNames?.length)
    chips.push({
      label:
        filters.categoryNames.length > 2
          ? `Categories: ${filters.categoryNames.slice(0, 2).join(", ")} +${
              filters.categoryNames.length - 2
            }`
          : `Categories: ${filters.categoryNames.join(", ")}`,
      key: "categoryIds",
    });

  if (filters.sourceNames?.length)
    chips.push({
      label:
        filters.sourceNames.length > 2
          ? `Sources: ${filters.sourceNames.slice(0, 2).join(", ")} +${
              filters.sourceNames.length - 2
            }`
          : `Sources: ${filters.sourceNames.join(", ")}`,
      key: "sourceIds",
    });

  if (filters.date)
    chips.push({ label: `Date: ${filters.date}`, key: "date" });

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm shadow-sm"
        >
          {chip.label}
          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="text-red-500 hover:text-red-700 font-bold"
            title="Remove filter"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
