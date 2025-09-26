//import React from "react";
import type { DashboardView } from "../../hooks/useDashboardView";

export default function DashboardNav({
  activeView,
  onChange,
}: {
  activeView: DashboardView;
  onChange: (view: DashboardView) => void;
}) {
  const tabs: { key: DashboardView; label: string }[] = [
    { key: "for-you", label: "For You" },
    { key: "all-news", label: "All News" },
    { key: "bookmarks", label: "Bookmarks" },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-sm mb-6 flex">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-3 font-semibold text-sm flex-1 ${
            activeView === key
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
