import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ArticleManager } from "../components/admin/ArticleManager";
import { TaxonomyManager } from "../components/admin/TaxonomyManager";
import { SettingsPanel } from "../components/admin/SettingsPanel";
import ThemeToggleButton from "../components/common/ThemeToggleButton";

const TABS = [
  { id: "articles", label: "Articles" },
  { id: "taxonomy", label: "Categories & Sources" },
  { id: "settings", label: "Feed Settings" },
];

export default function AdminPage() {
  const { role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setSigningOut(false);
    }
  };

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You need administrator privileges to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ThemeToggleButton />
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:text-emerald-300"
          >
            {signingOut ? "Signing out…" : "Log out"}
          </button>
        </div>

        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Admin Console</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Content operations</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage articles, taxonomy, feed defaults, and team roles — all powered by Supabase RLS.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/40">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-white text-emerald-600 shadow dark:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === "articles" && <ArticleManager />}
          {activeTab === "taxonomy" && <TaxonomyManager />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
