import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ArticleManager } from "../components/admin/ArticleManager";
import { TaxonomyManager } from "../components/admin/TaxonomyManager";
import { SettingsPanel } from "../components/admin/SettingsPanel";
import { RoleManager } from "../components/admin/RoleManager";

const TABS = [
  { id: "articles", label: "Articles" },
  { id: "taxonomy", label: "Categories & Sources" },
  { id: "settings", label: "Feed Settings" },
  { id: "roles", label: "Roles" },
];

export default function AdminPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

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
          {activeTab === "roles" && <RoleManager />}
        </div>
      </div>
    </div>
  );
}
