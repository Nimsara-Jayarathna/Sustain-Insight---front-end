import React from 'react';
import ArticleGrid from '../common/ArticleGrid';

const BookmarksView = () => {
  // ✅ Later you’ll fetch real bookmarked articles here
  const bookmarkedArticles: any[] = []; // empty for now

  return (
    <section>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <input
          type="search"
          placeholder="Search your bookmarks..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {bookmarkedArticles.length > 0 ? (
        <ArticleGrid articles={bookmarkedArticles} />
      ) : (
        <p className="text-center text-gray-500 mt-8">
          You don’t have any saved bookmarks yet.
        </p>
      )}
    </section>
  );
};

export default BookmarksView;
