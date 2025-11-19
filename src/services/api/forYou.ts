import type { Article } from "../../types/content";
import { supabase } from "../../lib/supabaseClient";

export type ForYouFeedResponse = {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
};

type ForYouParams = {
  page?: number;
};

const getFunctionsUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
  const parsed = new URL(supabaseUrl);
  const host = parsed.host.replace(".supabase.co", ".functions.supabase.co");
  return `${parsed.protocol}//${host}`;
};

export async function fetchForYouFeed(params: ForYouParams): Promise<ForYouFeedResponse> {
  const url = new URL("/for-you", getFunctionsUrl());
  if (params.page) url.searchParams.set("page", String(params.page));

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
    throw new Error(payload.error ?? "Unable to load personalized articles");
  }

  const payload = (await response.json()) as ForYouFeedResponse;
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
