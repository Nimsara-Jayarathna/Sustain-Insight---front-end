import { supabase } from "../../../lib/supabaseClient";

const getFunctionsUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }
  const parsed = new URL(supabaseUrl);
  const host = parsed.host.replace(".supabase.co", ".functions.supabase.co");
  return `${parsed.protocol}//${host}`;
};

const buildHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const request = async (path: string | URL, init: RequestInit = {}) => {
  const headers = await buildHeaders();
  const target = typeof path === "string" ? new URL(path, getFunctionsUrl()) : path;
  return fetch(target.toString(), {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(headers ?? {}),
    },
  });
};

export type ArticleFormValues = {
  title: string;
  summary?: string;
  content?: string;
  source?: string | null;
  sourceId?: string | null;
  categoryIds: string[];
  publishedAt?: string | null;
  imageUrl?: string | null;
};

export type AdminArticleRecord = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  source?: string | null;
  source_id?: string | null;
  published_at?: string | null;
  insight_count?: number | null;
  category_ids?: string[] | null;
  image_url?: string | null;
};

export type ArticleInsightDetail = {
  id: number;
  userId: string;
  fullName: string | null;
  createdAt: string;
};

export type ArticlePreviewRecord = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  source?: string | null;
  sources: string[];
  categories: { id: string; name: string | null }[];
  insightCount: number;
};

const handleError = async (response: Response, fallback = "Unable to complete request") => {
  const payload = await response.json().catch(() => ({}));
  throw new Error(payload.error ?? fallback);
};

export async function fetchAdminArticles(): Promise<AdminArticleRecord[]> {
  const url = new URL("/admin-articles", getFunctionsUrl());
  const response = await request(url, { method: "GET" });
  if (!response.ok) {
    await handleError(response, "Unable to load admin articles");
  }
  const payload = (await response.json()) as { data?: AdminArticleRecord[] };
  return payload.data ?? [];
}

export async function fetchArticlePreview(articleId: string): Promise<ArticlePreviewRecord> {
  const url = new URL("/admin-articles", getFunctionsUrl());
  url.searchParams.set("mode", "preview");
  url.searchParams.set("id", articleId);
  const response = await request(url, { method: "GET" });
  if (!response.ok) {
    await handleError(response, "Unable to load article preview");
  }
  return (await response.json()) as ArticlePreviewRecord;
}

export async function fetchArticleInsightsDetail(articleId: string): Promise<ArticleInsightDetail[]> {
  const url = new URL("/admin-articles", getFunctionsUrl());
  url.searchParams.set("mode", "insights");
  url.searchParams.set("id", articleId);
  const response = await request(url, { method: "GET" });
  if (!response.ok) {
    await handleError(response, "Unable to load article insights");
  }
  const payload = (await response.json()) as { data?: ArticleInsightDetail[] };
  return payload.data ?? [];
}

export async function createAdminArticle(values: ArticleFormValues): Promise<void> {
  const response = await request("/admin-articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    await handleError(response, "Unable to create article");
  }
}

export async function updateAdminArticle(articleId: string, values: ArticleFormValues): Promise<void> {
  const response = await request("/admin-articles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...values, id: articleId }),
  });
  if (!response.ok) {
    await handleError(response, "Unable to update article");
  }
}

export async function deleteAdminArticle(articleId: string): Promise<void> {
  const url = new URL("/admin-articles", getFunctionsUrl());
  url.searchParams.set("id", articleId);
  const response = await request(url, { method: "DELETE" });
  if (!response.ok) {
    await handleError(response, "Unable to delete article");
  }
}
