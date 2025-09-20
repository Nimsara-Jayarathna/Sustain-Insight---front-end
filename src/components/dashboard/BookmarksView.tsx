import React from 'react';
import { articles } from '../../placeholder-data';
import ArticleGrid from './ArticleGrid';

const BookmarksView = () => {
  // Filter for bookmarked articles
  const bookmarkedArticles = articles.filter(article => article.bookmarked);

  return (
    <section>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <input 
          type="search" 
          placeholder="Search your bookmarks..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <ArticleGrid articles={bookmarkedArticles} />
    </section>
  );
};

export default BookmarksView;
