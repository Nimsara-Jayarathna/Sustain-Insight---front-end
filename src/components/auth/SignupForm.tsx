import React from "react";

export default function SignupForm({
  onSubmit,
  onSwitch,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSwitch: (v: "login" | "signup") => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create Account</h2>

      <div>
        <label htmlFor="signup-first-name" className="mb-1 block text-sm font-medium">
          First Name
        </label>
        <input
          id="signup-first-name"
          type="text"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="signup-last-name" className="mb-1 block text-sm font-medium">
          Last Name
        </label>
        <input
          id="signup-last-name"
          type="text"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="signup-title" className="mb-1 block text-sm font-medium">
          Job Title
        </label>
        <input
          id="signup-title"
          type="text"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Sign Up
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="font-medium text-emerald-700 hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
