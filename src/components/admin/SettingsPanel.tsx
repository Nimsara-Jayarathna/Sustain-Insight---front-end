import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { useAuth } from "../../hooks/useAuth";

export function SettingsPanel() {
  const { landingArticleCount, feedPageSize, feedRecentHours, loading, error, initialize, saveSettings } = useSettings();
  const { user } = useAuth();
  const [formValues, setFormValues] = useState({
    landing: landingArticleCount,
    feedSize: feedPageSize,
    feedHours: feedRecentHours,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  useEffect(() => {
    setFormValues({
      landing: landingArticleCount,
      feedSize: feedPageSize,
      feedHours: feedRecentHours,
    });
  }, [landingArticleCount, feedPageSize, feedRecentHours]);

  const syncDefaults = () => {
    setFormValues({
      landing: landingArticleCount,
      feedSize: feedPageSize,
      feedHours: feedRecentHours,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings({
        landingArticleCount: formValues.landing,
        feedPageSize: formValues.feedSize,
        feedRecentHours: formValues.feedHours,
        updatedBy: user?.id,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Feed Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control the default pagination and recency windows that power the dashboard and landing experiences.
          </p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            initialize?.();
            syncDefaults();
          }}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
        >
          Refresh
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
          Landing page article count
          <input
            type="number"
            min={1}
            value={formValues.landing}
            onChange={(event) => setFormValues((prev) => ({ ...prev, landing: Number(event.target.value) }))}
            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
          />
        </label>

        <label className="flex flex-col rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
          Dashboard page size
          <input
            type="number"
            min={6}
            value={formValues.feedSize}
            onChange={(event) => setFormValues((prev) => ({ ...prev, feedSize: Number(event.target.value) }))}
            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
          />
        </label>

        <label className="flex flex-col rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
          Feed recency window (hours)
          <input
            type="number"
            min={1}
            value={formValues.feedHours}
            onChange={(event) => setFormValues((prev) => ({ ...prev, feedHours: Number(event.target.value) }))}
            className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-base text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={syncDefaults}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:border-slate-700 dark:text-slate-200"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={saving || loading}
          onClick={handleSave}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Update settings"}
        </button>
      </div>
    </section>
  );
}
