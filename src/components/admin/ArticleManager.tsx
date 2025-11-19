import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  fetchPreferenceCatalog,
  createCatalogCategory,
  createCatalogSource,
} from "../../services/api/preferences";
import {
  fetchAdminArticles,
  createAdminArticle,
  updateAdminArticle,
  deleteAdminArticle,
  fetchArticleInsightsDetail,
  fetchArticlePreview,
} from "../../services/api/admin/articles";
import type {
  AdminArticleRecord,
  ArticleFormValues,
  ArticleInsightDetail,
  ArticlePreviewRecord,
} from "../../services/api/admin/articles";
import type { Category, Source } from "../../types/content";
import ArticleModal from "../articles/ArticleModal";

const emptyForm: ArticleFormValues = {
  title: "",
  summary: "",
  content: "",
  source: "",
  sourceId: null,
  categoryIds: [],
  publishedAt: new Date().toISOString(),
  imageUrl: "",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function ArticleManager() {
  const [articles, setArticles] = useState<AdminArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<ArticleFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [insightArticle, setInsightArticle] = useState<AdminArticleRecord | null>(null);
  const [insights, setInsights] = useState<ArticleInsightDetail[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticlePreviewRecord | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingSource, setCreatingSource] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [articleRows, catalog] = await Promise.all([fetchAdminArticles(), fetchPreferenceCatalog()]);
        setArticles(articleRows);
        setCategories(catalog.categories);
        setSources(catalog.sources);
        setError(null);
      } catch (err: any) {
        setError(err.message ?? "Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setFormValues({
      ...emptyForm,
      publishedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (article: AdminArticleRecord) => {
    setFormValues({
      title: article.title,
      summary: article.summary ?? "",
      content: article.content ?? "",
      source: article.source ?? "",
      sourceId: article.source_id ?? null,
      categoryIds: article.category_ids ?? [],
      publishedAt: article.published_at ?? undefined,
      imageUrl: article.image_url ?? "",
    });
    setEditingId(article.id);
    setFormOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateAdminArticle(editingId, formValues);
      } else {
        await createAdminArticle(formValues);
      }
      const refreshed = await fetchAdminArticles();
      setArticles(refreshed);
      setFormOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? "Unable to save article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!window.confirm("Delete this article? This action cannot be undone.")) return;
    try {
      await deleteAdminArticle(articleId);
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch (err: any) {
      setError(err.message ?? "Unable to delete article.");
    }
  };

  const openInsights = async (article: AdminArticleRecord) => {
    setInsightArticle(article);
    setInsights([]);
    setInsightsLoading(true);
    try {
      const rows = await fetchArticleInsightsDetail(article.id);
      setInsights(rows);
    } catch (err: any) {
      setError(err.message ?? "Unable to load insight data.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const created = await createCatalogCategory(newCategoryName.trim());
      setCategories((prev) => [...prev, created]);
      setFormValues((prev) => ({
        ...prev,
        categoryIds: [...prev.categoryIds, created.id],
      }));
      setNewCategoryName("");
    } catch (err: any) {
      setError(err.message ?? "Unable to create category.");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) return;
    setCreatingSource(true);
    try {
      const created = await createCatalogSource(newSourceName.trim());
      setSources((prev) => [...prev, created]);
      setFormValues((prev) => ({
        ...prev,
        sourceId: created.id,
        source: created.name,
      }));
      setNewSourceName("");
    } catch (err: any) {
      setError(err.message ?? "Unable to create source.");
    } finally {
      setCreatingSource(false);
    }
  };

  const handlePreview = async (articleId: string) => {
    setPreviewArticle(null);
    setPreviewingId(articleId);
    try {
      const preview = await fetchArticlePreview(articleId);
      setPreviewArticle(preview);
    } catch (err: any) {
      setError(err.message ?? "Unable to preview article.");
    } finally {
      setPreviewingId((current) => (current === articleId ? null : current));
    }
  };

  const articleCountText = useMemo(() => {
    if (articles.length === 0) return "No articles yet.";
    if (articles.length === 1) return "1 article";
    return `${articles.length} articles`;
  }, [articles.length]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Articles</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{articleCountText}</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          New Article
        </button>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading articles…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-100 text-left font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-center">Insights</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{article.title}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{article.source ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(article.published_at)}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                    {article.insight_count ?? 0}
                  </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => handlePreview(article.id)}
                      disabled={previewingId === article.id}
                    >
                      {previewingId === article.id ? "Previewing…" : "Preview"}
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                        onClick={() => openInsights(article)}
                      >
                        Insights
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                        onClick={() => openEditForm(article)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-red-500 hover:text-red-400"
                        onClick={() => handleDelete(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {editingId ? "Edit Article" : "New Article"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fill the fields below. Categories and sources can be managed from the taxonomy tab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
                <input
                  type="text"
                  required
                  value={formValues.title}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Summary</label>
                <textarea
                  value={formValues.summary}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, summary: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Content</label>
                <textarea
                  value={formValues.content}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, content: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Image URL</label>
                <input
                  type="url"
                  value={formValues.imageUrl ?? ""}
                  placeholder="https://example.com/image.jpg"
                  onChange={(event) => setFormValues((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Source</label>
                <select
                  value={formValues.sourceId ?? ""}
                  onChange={(event) => {
                    const selectedId = event.target.value || "";
                    const selected = sources.find((source) => source.id === selectedId);
                    setFormValues((prev) => ({
                      ...prev,
                      sourceId: selectedId || null,
                      source: selected?.name ?? "",
                    }));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">—</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newSourceName}
                    placeholder="Add new source"
                    onChange={(event) => setNewSourceName(event.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSource}
                    disabled={creatingSource || !newSourceName.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    {creatingSource ? "Adding…" : "Add source"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Published at</label>
                <input
                  type="datetime-local"
                  value={
                    formValues.publishedAt
                      ? new Date(formValues.publishedAt).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      publishedAt: event.target.value ? new Date(event.target.value).toISOString() : null,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Categories</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    placeholder="Add new category"
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    {creatingCategory ? "Adding…" : "Add category"}
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = formValues.categoryIds.includes(category.id);
                    return (
                      <label key={category.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const next = event.target.checked
                              ? [...formValues.categoryIds, category.id]
                              : formValues.categoryIds.filter((id) => id !== category.id);
                            setFormValues((prev) => ({ ...prev, categoryIds: next }));
                          }}
                        />
                        {category.name}
                      </label>
                    );
                  })}
                  {categories.length === 0 && (
                    <p className="text-sm text-slate-500">No categories yet. Use the taxonomy tab to add some.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:border-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId ? "Update Article" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewArticle && (
        <ArticleModal
          article={{
            id: previewArticle.id,
            title: previewArticle.title,
            summary: previewArticle.summary ?? undefined,
            content: previewArticle.content ?? undefined,
            imageUrl: previewArticle.imageUrl ?? undefined,
            publishedAt: previewArticle.publishedAt ?? undefined,
            sources: previewArticle.sources,
            categories: previewArticle.categories,
          }}
          bookmark={false}
          insight={false}
          insightCount={previewArticle.insightCount}
          allowActions={false}
          onToggleBookmark={(event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onToggleInsight={(event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClose={() => setPreviewArticle(null)}
        />
      )}

      {insightArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Insights</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {insightArticle.title} — {insightArticle.insight_count ?? 0} total
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInsightArticle(null);
                  setInsights([]);
                }}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {insightsLoading ? (
              <p className="mt-4 text-sm text-slate-500">Loading insights…</p>
            ) : insights.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No insights recorded for this article.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
                {insights.map((insight) => (
                  <li key={insight.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {insight.fullName ?? insight.userId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(insight.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                      Insighted
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
