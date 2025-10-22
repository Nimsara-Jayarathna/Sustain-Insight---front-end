import React, { useState } from "react";

type Props = {
  onSearch: (keyword: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-wrap items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 shadow-sm transition-colors focus-within:-translate-y-0.5 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900/80 sm:flex-nowrap"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-none text-gray-400 dark:text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
        <input
          type="search"
          placeholder="Search all articles..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>
      <button
        type="submit"
        className="flex-none rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
      >
        Search
      </button>
    </form>
  );
}
