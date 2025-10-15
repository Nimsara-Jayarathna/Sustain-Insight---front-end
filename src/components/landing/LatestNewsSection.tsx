// import React from "react";
import ArticleGrid from "../articles/ArticleGrid";
import ArticleRotator from "../articles/ArticleRotator"; // ✅ 1. Import the new Rotator component

type LatestNewsSectionProps = {
  articles: any[];
  isLoading: boolean;
  disablePopup?: boolean;
};

export default function LatestNewsSection({
  articles,
  isLoading,
  disablePopup = false,
}: LatestNewsSectionProps) {

  // We no longer need to separate the articles. The rotator handles the whole list.
  const featuredArticles = articles?.slice(0, 5); // Take the first 5 articles to feature
  const otherArticles = articles?.slice(5); // The rest can go in the grid

  return (
    <section
      id="latest"
      className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Latest in Climate News
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          A real-time look at the most recent developments in sustainability from around the globe.
        </p>
      </div>

      {/* ✅ 2. Use the new ArticleRotator and pass it the list of articles to feature */}
      <ArticleRotator
        articles={featuredArticles} 
        isLoading={isLoading} 
      />

      {/* Conditionally render the grid for the "other" articles */}
      {!isLoading && otherArticles && otherArticles.length > 0 && (
        <>
          <div className="text-center mt-20 mb-12 sm:mt-24">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              More Recent Developments
            </h3>
          </div>
          <ArticleGrid
            articles={otherArticles}
            mode="grid"
            disablePopup={disablePopup}
          />
        </>
      )}
    </section>
  );
}