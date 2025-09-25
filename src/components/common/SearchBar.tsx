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
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-1/2">
      <input
        type="search"
        placeholder="Search all articles..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
}
