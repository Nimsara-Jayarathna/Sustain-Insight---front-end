// import React from "react";
import ArticleGrid from "../articles/ArticleGrid";

type LatestNewsSectionProps = {
  articles: any[];
  isLoading: boolean; // ✅ New prop
  disablePopup?: boolean;
};

export default function LatestNewsSection({
  articles,
  isLoading, // Destructure the new prop
  disablePopup = false,
}: LatestNewsSectionProps) {
  return (
    <section
      id="latest"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
    >
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
        Latest in Climate News
      </h2>
      <ArticleGrid
        articles={articles}
        isLoading={isLoading} // ✅ Pass it down
        variant="landing"
        mode="carousel"
        speed={40}
        disablePopup={disablePopup}
      />
    </section>
  );
}