// import React from "react";
import ArticleGrid from "../articles/ArticleGrid";
import ArticleRotator from "../articles/ArticleRotator"; // ✅ 1. Import the new Rotator component

type LatestNewsSectionProps = {
  articles: any[];
  isLoading: boolean;
  disablePopup?: boolean;
  onRequireAuth?: () => void;
};

export default function LatestNewsSection({
  articles,
  isLoading,
  disablePopup = false,
  onRequireAuth,
}: LatestNewsSectionProps) {
  // We no longer need to separate the articles. The rotator handles the whole list.
  const featuredArticles = articles?.slice(0, 5); // Take the first 5 articles to feature
  const otherArticles = articles?.slice(5); // The rest can go in the grid

  return (
    <section
      id="latest"
      className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/20 sm:left-10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/20 sm:right-10" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            Live Sustainability Feed
            <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 dark:bg-emerald-300" />
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors sm:text-4xl dark:text-slate-100">
            Latest in Sustainability News
          </h2>
          <p className="text-lg leading-8 text-gray-600 transition-colors dark:text-slate-300">
            A real-time digest of ESG regulation, corporate responsibility commitments, and sustainable innovation shaping global business.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
            {["40+ sustainability outlets", "Updated every 10 minutes", "Analyst-grade AI summaries"].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 font-medium text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-slate-900/70 dark:text-emerald-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[34px] border border-white/60 bg-white/80 p-1 shadow-[0_45px_80px_-40px_rgba(16,185,129,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_45px_80px_-40px_rgba(16,185,129,0.25)]">
            <ArticleRotator articles={featuredArticles} isLoading={isLoading} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-4 text-sm text-emerald-800 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 sm:px-8">
            <span className="font-semibold">
              Stay ahead of material ESG issues, reputational risk, and market expectations.
            </span>
            <button
              type="button"
              onClick={() => onRequireAuth?.()}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl"
            >
              Create a free account
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {!isLoading && otherArticles && otherArticles.length > 0 && (
          <>
            <div className="mt-20 text-center sm:mt-24">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 transition-colors sm:text-3xl dark:text-slate-100">
                More Recent Developments
              </h3>
            </div>
            <div className="mt-12">
              <ArticleGrid
                articles={otherArticles}
                mode="grid"
                variant="landing"
                disablePopup={disablePopup}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
