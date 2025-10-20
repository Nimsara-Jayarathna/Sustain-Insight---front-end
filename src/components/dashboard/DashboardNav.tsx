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
    <nav className="sticky top-20 z-30 mb-6 rounded-2xl border border-gray-200 bg-white/90 p-1 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {tabs.map(({ key, label }) => {
          const isActive = activeView === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
