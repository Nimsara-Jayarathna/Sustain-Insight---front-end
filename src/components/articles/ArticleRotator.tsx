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

  return (
    <div
      className="w-full font-sans relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1]">
        
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>

        {/* Layer 3: Text Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100 animate-slide-in' : 'opacity-0 pointer-events-none'
              }`}
            >
              <p 
                className="text-sm font-semibold text-green-400 uppercase tracking-wider" 
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
            </div>
          ))}
        </div>
        
        {/* Layer 4: Arrow Controls */}
        {articles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
              aria-label="Previous article"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
              aria-label="Next article"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Layer 5: Navigation / Progress Bars */}
      {articles.length > 1 && (
        <div className="absolute -bottom-2 w-full flex justify-center space-x-2 p-4 z-10">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-full h-1 bg-white/30 rounded-full overflow-hidden"
              aria-label={`Go to article ${index + 1}`}
            >
              {index === currentIndex && (
                <div
                  className="h-full bg-green-500 rounded-full animate-progress"
                  style={{
                    animationDuration: `${interval}ms`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                  key={`${currentIndex}-${isPaused}`}
                ></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleRotator;