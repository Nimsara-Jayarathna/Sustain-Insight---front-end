import ArticleGrid from "../common/ArticleGrid";

type LatestNewsSectionProps = {
  articles: any[];
  disablePopup?: boolean;
  showBookmark?: boolean;
};

export default function LatestNewsSection({
  articles,
  disablePopup = false,
  showBookmark = true,
}: LatestNewsSectionProps) {
  return (
    <section id="latest" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
        Latest in Climate News
      </h2>
      <ArticleGrid
        articles={articles}
        mode="carousel"
        speed={100}
        disablePopup={disablePopup}
        showBookmark={showBookmark}
      />
    </section>
  );
}
