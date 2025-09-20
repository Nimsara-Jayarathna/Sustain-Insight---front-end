import React from 'react';
import { articles } from '../../placeholder-data';
import ArticleGrid from './ArticleGrid';

const AllNewsView = () => {
  // In a real app, state would be used to manage filter values
  return (
    <section>
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
      <ArticleGrid articles={articles} />
      {/* Pagination would go here in a real app */}
    </section>
  );
};

export default AllNewsView;
