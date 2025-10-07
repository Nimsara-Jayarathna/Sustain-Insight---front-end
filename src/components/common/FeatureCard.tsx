import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color?: "emerald" | "cyan" | "indigo"; // accent tone
};

export default function FeatureCard({ icon, title, desc, color = "emerald" }: Props) {
  const colorStyles: Record<string, string> = {
    emerald: "from-emerald-50/80 to-white text-emerald-600",
    cyan: "from-cyan-50/80 to-white text-cyan-600",
    indigo: "from-indigo-50/80 to-white text-indigo-600",
  };

  return (
    <div
      className={`group relative flex flex-col items-start rounded-2xl bg-gradient-to-br ${colorStyles[color]}
      p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        {desc}
      </p>

      {/* Soft bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
