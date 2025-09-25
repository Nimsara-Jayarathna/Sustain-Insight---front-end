import React, { useEffect, useState } from 'react';
import ArticleGrid from '../common/ArticleGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { apiFetch } from '../../utils/api'; // Assuming apiFetch is in utils/api

const ForYouView = () => {
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForYouArticles() {
      try {
        setLoading(true);
        setError(null);
        // This endpoint requires authentication
        const data = await apiFetch('/api/articles/feed');
        setRecentArticles(data);
      } catch (err) {
        console.error('DEBUG → Failed to fetch For You articles:', err);
        setError('Failed to load personalized articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchForYouArticles();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Daily Briefing</h2>
        <p className="text-gray-600">
          The latest news from the last 24 hours, tailored to your preferences.
        </p>
      </header>

      {loading ? (
        <p className="text-center text-gray-600">Loading your personalized feed...</p>
      ) : error ? (
        <div className="text-center mt-12 p-8 bg-red-100 text-red-700 rounded-lg shadow-sm">
          <p>{error}</p>
        </div>
      ) : recentArticles.length > 0 ? (
        <ArticleGrid articles={recentArticles} />
      ) : (
        <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-4xl mb-3"
          />
          <h3 className="text-xl font-bold text-gray-800">You're all caught up!</h3>
          <p className="text-gray-600">Check back later for new stories.</p>
        </div>
      )}
    </section>
  );
};

export default ForYouView;
