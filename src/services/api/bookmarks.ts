import { supabase } from "../../lib/supabaseClient";
import type { Article } from "../../types/content";

export type BookmarksResponse = {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
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

type BookmarkParams = {
  page?: number;
};

export async function fetchBookmarks(params: BookmarkParams): Promise<BookmarksResponse> {
  const url = new URL("/bookmarks", getFunctionsUrl());
  if (params.page) url.searchParams.set("page", String(params.page));

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load bookmarks");
  }

  const payload = (await response.json()) as BookmarksResponse;
  payload.data = payload.data.map((article) => ({
    ...article,
    categories: (article.categories ?? []).map((category) => ({
      id: category.id,
      name: category.name ?? "",
    })),
    sources: article.sources?.filter(Boolean) ?? [],
  }));

  return payload;
}
