import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";

export default function SignupForm({
  onSubmit,
  onSwitch,
}: {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    password: string;
  }) => Promise<void>;
  onSwitch: (v: "login" | "signup") => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({ firstName, lastName, title, email, password });
      setSuccess(true);
      //setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>

        <div>
          <label htmlFor="signup-first-name" className="mb-1 block text-sm font-medium">
            First Name
          </label>
          <input
            id="signup-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
          />
        </div>

        {error && <p className="text-sm text-center text-red-500 mt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-emerald-700 disabled:opacity-60 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="font-medium text-emerald-700 hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </form>

      {/* Overlay animation for blocking background */}
      <AuthLoadingOverlay
        loading={loading}
        success={success}
        message={success ? "Account created successfully!" : "Creating your account..."}
      />
    </div>
  );
}
