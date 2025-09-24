import React from "react";

export default function LoginForm({
  onSubmit,
  onSwitch,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSwitch: (v: "login" | "signup") => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome Back</h2>

      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-600">
        No account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          className="font-medium text-emerald-700 hover:underline"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
