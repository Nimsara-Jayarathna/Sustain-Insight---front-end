//import React from "react";

export default function HeroSection({
  onSignup,
}: {
  onSignup: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-24 lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Actionable Insights on Climate Change, in Real-Time.
          </h1>
          <p className="mt-4 max-w-prose text-base text-gray-600 sm:text-lg">
            Sustain Insight cuts through the noise, delivering a personalized news feed.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              onClick={onSignup}
            >
              Get Started for Free
            </button>
            <a
              href="#latest"
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium hover:bg-gray-50"
            >
              See Latest News
            </a>
          </div>
        </div>

        <div className="relative">
  <div className="relative flex justify-center items-center">
  <div className="aspect-square w-48 sm:w-56 md:w-64 rounded-full overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.25)] ring-1 ring-gray-200 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 bg-gradient-to-br from-emerald-50 to-emerald-100">
    <img
      src="/icon.png"
      alt="News Icon"
      className="h-full w-full object-contain transition-transform duration-700 hover:rotate-[3deg]"
    />
  </div>

  {/* ambient radial light effect */}
  <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.15),transparent_70%)] blur-2xl" />
</div></div>
      </div>
    </section>
  );
}
