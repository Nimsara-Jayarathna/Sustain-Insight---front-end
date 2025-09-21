import React from "react";

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
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm ring-1 ring-gray-200" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.2),transparent)]" />
        </div>
      </div>
    </section>
  );
}
