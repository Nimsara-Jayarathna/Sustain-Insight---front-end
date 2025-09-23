import React, { useEffect, useState } from 'react';
import ArticleGrid from '../common/ArticleGrid';


const backendURL = import.meta.env.VITE_BACKEND_URL;

const AllNewsView = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${backendURL}/api/public/articles/all`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching all articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section>
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <input 
          type="search" 
          placeholder="Search all articles..."
          className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="w-full md:w-2/3 flex items-center gap-4">
          <select className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="">All Categories</option>
            <option value="Energy">Energy</option>
            <option value="Policy">Policy</option>
            <option value="Tech">Tech</option>
          </select>
          <input 
            type="date" 
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="text-sm text-gray-600 hover:text-black">Clear</button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-600">Loading articles...</p>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </section>
  );
};

export default AllNewsView;
