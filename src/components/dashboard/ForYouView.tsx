import React from 'react';
import { articles } from '../../placeholder-data';
import ArticleGrid from '../common/ArticleGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ForYouView = () => {
  // In a real app, you would fetch and filter data for the last 24 hours
  const recentArticles = articles.slice(0, 2);

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Daily Briefing</h2>
        <p className="text-gray-600">The latest news from the last 24 hours, tailored to your preferences.</p>
      </header>
      <ArticleGrid articles={recentArticles} />

      {/* "All Caught Up" Message */}
      <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-3" />
        <h3 className="text-xl font-bold text-gray-800">You're all caught up!</h3>
        <p className="text-gray-600">Check back later for new stories.</p>
      </div>
    </section>
  );
};

export default ForYouView;