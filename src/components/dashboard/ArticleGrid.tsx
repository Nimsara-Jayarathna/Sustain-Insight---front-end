import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No articles found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleGrid;