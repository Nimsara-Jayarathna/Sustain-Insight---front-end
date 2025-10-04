import FeatureCard from "../common/FeatureCard";

export default function FeaturesSection() {
  return (
    <section className="relative isolate mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 opacity-80" />

      {/* Section heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Empowering Sustainable Insights
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
          Discover, personalize, and stay ahead with intelligent news curation.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<span className="text-4xl">🤖</span>}
          title="Automated Aggregation"
          desc="We continuously gather sustainability news from verified global sources, so you never miss an update."
          color="emerald"
        />
        <FeatureCard
          icon={<span className="text-4xl">🏷️</span>}
          title="Intelligent Filtering"
          desc="Sort and refine by category, region, or source — quickly zero in on what matters most to you."
          color="cyan"
        />
        <FeatureCard
          icon={<span className="text-4xl">🔖</span>}
          title="Personalized Feed"
          desc="Save your favorite topics and build a unique news stream aligned with your interests."
          color="indigo"
        />
      </div>
    </section>
  );
}
