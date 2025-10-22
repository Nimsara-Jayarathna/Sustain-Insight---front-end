// import React from "react";
import FeatureCard from "../common/FeatureCard";

// --- Helper Icons (can be moved to a shared file) ---
const RobotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75c0 3.22-2.69 5.82-6 5.82S5.25 9.97 5.25 6.75m12 0c0-1.56-1.29-2.82-2.88-2.82s-2.88 1.26-2.88 2.82m5.76 0v.3M11.25 3.75v.3m-5.76 2.7v.3M5.25 6.75H3m18 0h-2.25M12 18.75a6 6 0 00-6-6H3.375a18.75 18.75 0 000 12h17.25a18.75 18.75 0 000-12H18a6 6 0 00-6 6z" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>;
const BookmarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>;

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative isolate mx-auto max-w-7xl px-4 py-20 transition-colors sm:px-6 sm:py-28 lg:px-8"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gray-50 dark:bg-slate-900/80" />

      <div className="mb-12 text-center sm:mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 transition-colors sm:text-4xl dark:text-slate-100">
          Built for Sustainability Intelligence Teams
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600 transition-colors dark:text-slate-300">
          Aggregate ESG, CSR, and supply chain coverage; tune it to your mandate; and share the right narrative with stakeholders in minutes.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<RobotIcon />}
          title="Sustainability Signal Engine"
          desc="Track verified ESG, climate risk, and responsible investment sources across regions without hopping between tabs."
          color="emerald"
        />
        <FeatureCard
          icon={<FilterIcon />}
          title="Contextual Briefings"
          desc="Slice stories by framework, sector, or geography, then publish tailored briefings for executives, investors, or suppliers."
          color="cyan"
        />
        <FeatureCard
          icon={<BookmarkIcon />}
          title="Shared Sustainability Workspace"
          desc="Bookmark, annotate, and assign follow-ups so policy, procurement, and sustainability leads stay aligned on what matters next."
          color="indigo"
        />
      </div>
    </section>
  );
}
