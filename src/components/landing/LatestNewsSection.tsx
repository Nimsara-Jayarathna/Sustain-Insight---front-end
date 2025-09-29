//import React from "react";
import ArticleGrid from "../common/ArticleGrid";

export default function LatestNewsSection({ articles }: { articles: any[] }) {
  return (
    <section id="latest" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
        Latest in Climate News
      </h2>
      <ArticleGrid articles={articles} mode="carousel" speed={100} />
    </section>
  );
}
