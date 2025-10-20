import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color?: "emerald" | "cyan" | "indigo"; // accent tone
};

const palettes = {
  emerald: {
    background: "from-emerald-50/80 to-white",
    titleHover: "group-hover:text-emerald-700",
    glow: "via-emerald-100",
    iconTint: "text-emerald-600",
  },
  cyan: {
    background: "from-cyan-50/80 to-white",
    titleHover: "group-hover:text-cyan-700",
    glow: "via-cyan-100",
    iconTint: "text-cyan-600",
  },
  indigo: {
    background: "from-indigo-50/80 to-white",
    titleHover: "group-hover:text-indigo-700",
    glow: "via-indigo-100",
    iconTint: "text-indigo-600",
  },
};

export default function FeatureCard({ icon, title, desc, color = "emerald" }: Props) {
  const palette = palettes[color] ?? palettes.emerald;

  return (
    <div
      className={`group relative flex w-full flex-col items-start rounded-2xl bg-gradient-to-br ${palette.background}
      p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7`}
    >
      {/* Icon */}
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-2xl ${palette.iconTint} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
        <span>{icon}</span>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold leading-snug text-gray-900 ${palette.titleHover}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-gray-700">
        {desc}
      </p>

      {/* Soft bottom glow */}
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent ${palette.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
    </div>
  );
}
