// import React from "react";

export default function HeroSection({ onSignup }: { onSignup: () => void }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 -top-48 -z-10 h-80 bg-gradient-to-b from-emerald-100/40 via-white to-white blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-x-16 lg:py-28 lg:px-8">
        <div className="flex flex-col justify-center gap-8 lg:gap-10">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              The Sustainability Intelligence Briefing, Delivered Daily.
            </h1>
            <p className="text-lg leading-8 text-gray-600">
              Sustain Insight scans global ESG, circularity, policy, and impact investing coverage—curating the sustainability headlines your teams actually need.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-700">
              {["ESG regulation alerts", "Supply chain resilience updates", "Impact capital & innovation"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <button
              className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
              onClick={onSignup}
            >
              Get Started for Free
            </button>
            <a
              href="#latest"
              className="group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold leading-6 text-gray-900 transition hover:bg-gray-50"
            >
              See Latest News <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:mt-0 lg:max-w-lg">
          <div className="absolute -top-20 -right-10 hidden h-36 w-36 rounded-full bg-emerald-200/60 blur-3xl sm:block" />
          <div className="absolute -bottom-16 -left-12 hidden h-36 w-36 rounded-full bg-cyan-100/70 blur-3xl lg:block" />
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-emerald-50 to-white shadow-2xl ring-1 ring-gray-900/10">
            <div className="aspect-square p-6 sm:p-8">
              <img
                src="/icon.png"
                alt="Sustain Insight Icon"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
