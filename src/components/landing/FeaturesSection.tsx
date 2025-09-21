import React from "react";
import FeatureCard from "../common/FeatureCard";

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard icon={<span>🤖</span>} title="Automated Aggregation" desc="We fetch news from top global sources automatically." />
        <FeatureCard icon={<span>🏷️</span>} title="Intelligent Filtering" desc="Instantly filter by category, source, or keywords." />
        <FeatureCard icon={<span>🔖</span>} title="Personalized Feed" desc="Save your favorite topics for a tailored news feed." />
      </div>
    </section>
  );
}
