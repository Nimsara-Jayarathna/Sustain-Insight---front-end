import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define a type for the article for better code quality
type Article = {
  id: string | number;
  imageUrl: string;
  category: string;
  title: string;
  excerpt: string;
  slug: string;
  url?: string;
  link?: string;
};

type ArticleRotatorProps = {
  articles: Article[];
  isLoading?: boolean;
  interval?: number; // Time in milliseconds for each slide
};

// --- A private, internal skeleton for this specific component ---
const ArticleRotatorSkeleton: React.FC = () => (
  <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] bg-gray-200 rounded-xl animate-pulse"></div>
);

const ArticleRotator: React.FC<ArticleRotatorProps> = ({ articles, isLoading = false, interval = 7000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (articles.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    if (articles.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
    }
  }, [articles.length]);

  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, isPaused, articles.length]);

  if (isLoading) {
    return <ArticleRotatorSkeleton />;
  }
  if (!articles || articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex];
  const primaryHref =
    currentArticle?.url ||
    currentArticle?.link ||
    (currentArticle?.slug ? `/articles/${currentArticle.slug}` : undefined);

  return (
    <div
      className="group relative w-full font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] bg-gray-900 shadow-[0_45px_80px_-40px_rgba(16,185,129,0.5)] sm:aspect-[16/9] lg:aspect-[2/1]">
        
        {/* Layer 1: Images with Ken Burns Effect */}
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
              // The key resets the animation on slide change
              key={article.id}
              style={{ animation: index === currentIndex ? `ken-burns ${interval + 2000}ms ease-out forwards` : 'none' }}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}

        {/* Layer 2: Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/40 to-black/20" />

        {/* Layer 2.5: Header */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:top-8 sm:left-8 sm:right-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
            Top Stories
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            Updated live
          </span>
        </div>

        {/* Layer 3: Text Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 lg:bottom-10 lg:left-10 lg:right-10 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 animate-slide-in' : 'opacity-0 pointer-events-none'
              }`}
            >
              <p 
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
              >
                {article.category}
              </p>
              
              {/* ✅ THE FIX: More lines on mobile, fewer on desktop, with a stable height */}
              <h1 
                className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 leading-tight line-clamp-3 sm:line-clamp-2 min-h-[6rem] sm:min-h-[7rem]" 
                style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}
              >
                {article.title}
              </h1>

              <div className="mt-4 border-t border-white/20 pt-4 max-w-md">
                <p 
                  className="text-gray-200 line-clamp-1 sm:line-clamp-2" 
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                >
                  {article.excerpt}
                </p>
              </div>

              {primaryHref && (
                <a
                  href={primaryHref}
                  target={primaryHref.startsWith("http") ? "_blank" : undefined}
                  rel={primaryHref.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read the story
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          ))}
        </div>
        
        {/* Layer 4: Arrow Controls */}
        {articles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:bg-white/40 focus:outline-none"
              aria-label="Previous article"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:bg-white/40 focus:outline-none"
              aria-label="Next article"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Layer 5: Navigation / Progress Bars */}
      {articles.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {articles.map((article, index) => (
            <button
              key={article.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex ? "scale-110 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-emerald-200"
              }`}
              aria-label={`Go to article ${index + 1}`}
            >
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleRotator;
