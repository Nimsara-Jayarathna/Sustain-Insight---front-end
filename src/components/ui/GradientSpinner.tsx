import { useId } from "react";

type GradientSpinnerProps = {
  className?: string;
  strokeWidth?: number;
};

export default function GradientSpinner({
  className = "h-10 w-10",
  strokeWidth = 3,
}: GradientSpinnerProps) {
  const gradientId = useId();

  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="56 140"
        opacity="0.35"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
