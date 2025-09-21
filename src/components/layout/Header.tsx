import React from "react";

export default function Header({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-600"></div>
          <span className="font-semibold tracking-tight">Sustain Insight</span>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-3">
          <button
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={onLogin}
          >
            Login
          </button>
          <button
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            onClick={onSignup}
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
}
