import { useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4V3m5.657 3.343l.707-.707M20 12h1m-3.343 5.657l.707.707M12 20v1m-5.657-3.343l-.707.707M4 12H3m3.343-5.657l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
    />
  </svg>
);

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const label = useMemo(
    () => (theme === "dark" ? "Switch to light mode" : "Switch to dark mode"),
    [theme],
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === "dark"}
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
    >
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"} mode</span>
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
