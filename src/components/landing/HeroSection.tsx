// import React from "react";

export default function HeroSection({
  onSignup,
}: {
  onSignup: () => void;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:py-32 lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Actionable Insights on Climate Change, in Real-Time.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Sustain Insight cuts through the noise, delivering a personalized and intelligent news feed focused on the sustainability topics that matter most to you.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <button
              className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:-translate-y-0.5"
              onClick={onSignup}
            >
              Get Started for Free
            </button>
            <a
              href="#latest"
              className="group flex items-center gap-x-2 rounded-lg px-6 py-3 text-base font-semibold leading-6 text-gray-900 transition hover:bg-gray-50"
            >
              See Latest News <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        <div className="relative mt-12 flex items-center justify-center lg:mt-0">
          <div className="relative animate-float">
            <div className="aspect-square w-56 sm:w-64 md:w-72 rounded-full overflow-hidden shadow-2xl ring-1 ring-gray-900/10 bg-gradient-to-br from-emerald-50 to-emerald-200">
              <img
                src="/icon.png"
                alt="Sustain Insight Icon"
                className="h-full w-full object-contain p-4"
              />
            </div>
            {/* Ambient glow effect */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-emerald-400/30 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

