// import React from "react";
import ArticleGrid from "../articles/ArticleGrid";

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
  return (
    <section
      id="latest"
      className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Latest in Climate News
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          A real-time look at the most recent developments in sustainability from around the globe.
        </p>
      </div>
      <ArticleGrid
        articles={articles}
        isLoading={isLoading}
        variant="landing"
        mode="carousel"
        speed={40}
        disablePopup={disablePopup}
      />
    </section>
  );
}