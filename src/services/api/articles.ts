import { supabase } from "../../lib/supabaseClient";
import type { Article } from "../../types/content";

export type ArticlesFeedResponse = {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
};

export type ArticlesFeedParams = {
  page?: number;
  search?: string;
  sort?: "newest" | "oldest" | "popular";
  dateFrom?: string;
  dateTo?: string;
  categories?: string[];
  sources?: string[];
};

const getFunctionsUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }
  const parsed = new URL(supabaseUrl);
  const host = parsed.host.replace(".supabase.co", ".functions.supabase.co");
  return `${parsed.protocol}//${host}`;
};

const appendList = (url: URL, key: string, values?: string[]) => {
  if (!values || values.length === 0) return;
  url.searchParams.set(key, values.join(","));
};

export async function fetchArticlesFeed(params: ArticlesFeedParams = {}): Promise<ArticlesFeedResponse> {
  const url = new URL("/all-news", getFunctionsUrl());
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.dateFrom) url.searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) url.searchParams.set("dateTo", params.dateTo);
  appendList(url, "categories", params.categories);
  appendList(url, "sources", params.sources);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load articles");
  }

  const payload = (await response.json()) as ArticlesFeedResponse;
  payload.data = payload.data.map((item) => ({
    ...item,
    categories: (item.categories ?? []).map((category) => ({
      id: category.id,
      name: category.name ?? "",
    })),
    sources: item.sources?.filter(Boolean) ?? [],
  }));
  return payload;
}
