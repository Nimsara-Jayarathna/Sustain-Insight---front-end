import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;

// Tailwind notes:
// - Ensure Tailwind is configured in your project.
// - This component is mobile-first and responsive.

export default function LandingPage() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup">("login");
  const [articles, setArticles] = useState<any[]>([]);

  // ✅ Fetch latest 3 articles from Spring Boot backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${backendURL}/api/public/articles/latest?limit=3`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  // --- Login handler ---
  const onSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any)["login-email"].value;
    const password = (e.target as any)["login-password"].value;

    try {
      const res = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Logged in user:", data);

      localStorage.setItem("token", data.token); // store JWT
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // --- Signup handler ---
  const onSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstName = (e.target as any)["signup-first-name"].value;
    const lastName = (e.target as any)["signup-last-name"].value;
    const jobTitle = (e.target as any)["signup-title"].value;
    const email = (e.target as any)["signup-email"].value;
    const password = (e.target as any)["signup-password"].value;

    try {
      const res = await fetch(`${backendURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, jobTitle, email, password }),
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      console.log("Signed up user:", data);

      localStorage.setItem("token", data.token); // store JWT
      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-600"></div>
            <span className="font-semibold tracking-tight">Sustain Insight</span>
          </div>
          <nav className="flex items-center gap-3">
            <button
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              onClick={() => {
                setView("login");
                setAuthOpen(true);
              }}
            >
              Login
            </button>
            <button
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              onClick={() => {
                setView("signup");
                setAuthOpen(true);
              }}
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-24 lg:px-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Actionable Insights on Climate Change, in Real‑Time.
            </h1>
            <p className="mt-4 max-w-prose text-base text-gray-600 sm:text-lg">
              Sustain Insight cuts through the noise, delivering a personalized news feed to power your research and decision‑making.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                onClick={() => {
                  setView("signup");
                  setAuthOpen(true);
                }}
              >
                Get Started for Free
              </button>
              <a
                href="#latest"
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium hover:bg-gray-50"
              >
                See Latest News
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm ring-1 ring-gray-200" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.2),transparent)]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">🤖</span>} title="Automated Aggregation" desc="We fetch news from top global sources automatically." />
          <FeatureCard icon={<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">🏷️</span>} title="Intelligent Filtering" desc="Instantly filter by category, source, or keywords." />
          <FeatureCard icon={<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">🔖</span>} title="Personalized Feed" desc="Save your favorite topics for a tailored news feed." />
        </div>
      </section>

      {/* Latest News Preview */}
       <section id="latest" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
          Latest in Climate News
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.id}
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  {a.sources?.map((s: any, idx: number) => (
                    <span
                      key={`${a.id}-${s.id ?? idx}`}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
                <h3 className="line-clamp-2 text-base font-semibold leading-snug">
                  {a.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {a.summary}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(a.publishedAt).toLocaleDateString()}
                  </span>
                  <button className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50">
                    Save
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600 sm:px-6 lg:px-8">
          © 2025 Sustain Insight · SE2012 Group Project
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        view={view}
        onClose={() => setAuthOpen(false)}
        onSwitch={(v) => setView(v)}
        onSubmitLogin={onSubmitLogin}
        onSubmitSignup={onSubmitSignup}
      />
    </div>
  );
}

// ---------- Components ----------
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function AuthModal({
  open,
  view,
  onClose,
  onSwitch,
  onSubmitLogin,
  onSubmitSignup,
}: {
  open: boolean;
  view: "login" | "signup";
  onClose: () => void;
  onSwitch: (v: "login" | "signup") => void;
  onSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmitSignup: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>

        {view === "login" ? (
          <form onSubmit={onSubmitLogin} className="space-y-4">
            <h2 className="text-xl font-semibold">Welcome Back</h2>
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="login-email" type="email" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="login-password" type="password" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">Login</button>
            <p className="text-center text-sm text-gray-600">
              No account? <button type="button" onClick={() => onSwitch("signup")} className="font-medium text-emerald-700 hover:underline">Create one</button>
            </p>
          </form>
        ) : (
          <form onSubmit={onSubmitSignup} className="space-y-4">
            <h2 className="text-xl font-semibold">Create Account</h2>

            <div>
              <label htmlFor="signup-first-name" className="mb-1 block text-sm font-medium">First Name</label>
              <input id="signup-first-name" type="text" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="signup-last-name" className="mb-1 block text-sm font-medium">Last Name</label>
              <input id="signup-last-name" type="text" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="signup-title" className="mb-1 block text-sm font-medium">Job Title</label>
              <input id="signup-title" type="text" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">Email</label>
              <input id="signup-email" type="email" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">Password</label>
              <input id="signup-password" type="password" required className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </div>

            <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</button>

            <p className="text-center text-sm text-gray-600">
              Already have an account? <button type="button" onClick={() => onSwitch("login")} className="font-medium text-emerald-700 hover:underline">Login</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
