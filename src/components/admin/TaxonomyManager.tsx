import { useEffect, useState } from "react";
import type { Category, Source } from "../../types/content";
import { fetchCategories } from "../../services/supabaseArticles";
import { fetchSources } from "../../services/supabaseUser";
import { createCategory, deleteCategory, createSource, deleteSource } from "../../services/supabaseAdmin";

export function TaxonomyManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSource, setNewSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [categoryRows, sourceRows] = await Promise.all([fetchCategories(), fetchSources()]);
        setCategories(categoryRows);
        setSources(sourceRows);
        setError(null);
      } catch (err: any) {
        setError(err.message ?? "Unable to load taxonomy data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const created = await createCategory(newCategory.trim());
      setCategories((prev) => [...prev, created]);
      setNewCategory("");
    } catch (err: any) {
      setError(err.message ?? "Unable to create category.");
    }
  };

  const addSource = async () => {
    if (!newSource.trim()) return;
    try {
      const created = await createSource(newSource.trim());
      setSources((prev) => [...prev, created]);
      setNewSource("");
    } catch (err: any) {
      setError(err.message ?? "Unable to create source.");
    }
  };

  const removeCategory = async (categoryId: string) => {
    if (!window.confirm("Delete this category? Existing articles may lose their reference.")) return;
    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    } catch (err: any) {
      setError(err.message ?? "Unable to delete category.");
    }
  };

  const removeSource = async (sourceId: string) => {
    if (!window.confirm("Delete this source?")) return;
    try {
      await deleteSource(sourceId);
      setSources((prev) => prev.filter((source) => source.id !== sourceId));
    } catch (err: any) {
      setError(err.message ?? "Unable to delete source.");
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Categories & Sources</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Maintain the taxonomy used by articles. Create new entries before assigning them to stories.
        </p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading taxonomy…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Categories</h3>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="New category name"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />
              <button
                type="button"
                onClick={addCategory}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>
            </div>
            <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                    <p className="text-xs text-slate-500">{category.slug ?? "—"}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-500 hover:text-red-400"
                    onClick={() => removeCategory(category.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
              {categories.length === 0 && <li className="py-2 text-sm text-slate-500">No categories yet.</li>}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sources</h3>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newSource}
                onChange={(event) => setNewSource(event.target.value)}
                placeholder="New source name"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />
              <button
                type="button"
                onClick={addSource}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>
            </div>
            <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {sources.map((source) => (
                <li key={source.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{source.name}</p>
                    <p className="text-xs text-slate-500">{source.slug ?? "—"}</p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-500 hover:text-red-400"
                    onClick={() => removeSource(source.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
              {sources.length === 0 && <li className="py-2 text-sm text-slate-500">No sources yet.</li>}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
