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
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        onSwitch("login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["firstName", "lastName", "title", "email", "password"].map((field) => (
            <div className="relative" key={field}>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                required
                placeholder={
                  field === "firstName"
                    ? "First Name"
                    : field === "lastName"
                    ? "Last Name"
                    : field === "title"
                    ? "Job Title"
                    : field === "email"
                    ? "Email Address"
                    : "Password"
                }
                value={(form as any)[field]}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none disabled:opacity-50"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-emerald-600 text-white font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center text-sm text-gray-600 pt-2">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className="font-medium text-emerald-600 hover:underline"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {(success || error) && (
        <AuthLoadingOverlay
          loading={false}
          success={success}
          error={error}
          message={
            success
              ? "Account created! Please verify your email before logging in."
              : error
          }
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
