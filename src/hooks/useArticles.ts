import { useCallback, useEffect, useMemo, useState } from "react";
import type { Article } from "../types/content";
import { fetchLatestArticles } from "../services/supabaseArticles";
import { fetchForYouFeed } from "../services/api/forYou";
import { fetchArticlesFeed } from "../services/api/articles";
import type { ArticleFilters } from "../types/content";
import { useAuth } from "./useAuth";
import { useFilterStore } from "../stores/filterStore";

type UseArticlesOptions = Partial<ArticleFilters> & {
  page?: number;
  pageSize?: number;
  latest?: boolean;
  personalized?: boolean;
  enabled?: boolean;
};

export function useArticles(options?: UseArticlesOptions) {
  const { user, initialize } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const enabled = options?.enabled ?? true;
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  const { enabled: _ignored, ...normalizedOptionsInput } = options ?? {};
  const optionsKey = JSON.stringify(normalizedOptionsInput);
  const normalizedOptions = useMemo(() => normalizedOptionsInput, [optionsKey]);

  const query = useMemo(
    () => ({
      page: normalizedOptions.page ?? 1,
      pageSize: normalizedOptions.pageSize ?? 12,
      sort: normalizedOptions.sort ?? "newest",
      search: normalizedOptions.search ?? "",
      categories: normalizedOptions.categories ?? [],
      sources: normalizedOptions.sources ?? [],
      dateFrom: normalizedOptions.dateFrom,
      dateTo: normalizedOptions.dateTo,
      latest: normalizedOptions.latest ?? false,
      personalized: normalizedOptions.personalized ?? false,
      userId: user?.id,
    }),
    [normalizedOptions, user?.id],
  );

  const [resolvedPageSize, setResolvedPageSize] = useState(query.pageSize);

  useEffect(() => {
    if (!query.personalized) {
      setResolvedPageSize(query.pageSize);
    }
  }, [query.pageSize, query.personalized]);

  const loadArticles = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      if (query.latest) {
        const latest = await fetchLatestArticles(query.pageSize, user?.id ?? undefined);
        setArticles(latest);
        setTotal(latest.length);
        setResolvedPageSize(query.pageSize);
      } else if (query.personalized) {
        const result = await fetchForYouFeed({
          page: query.page,
        });
        setArticles(result.data);
        setTotal(result.total);
        setResolvedPageSize(result.pageSize);
      } else {
        const result = await fetchArticlesFeed({
          page: query.page,
          search: query.search || undefined,
          sort: query.sort,
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
          categories: query.categories,
          sources: query.sources,
        });
        setArticles(result.data);
        setTotal(result.total);
        setResolvedPageSize(result.pageSize);
      }
    } catch (err: any) {
      setArticles([]);
      setTotal(0);
      setError(err.message ?? "Unable to load articles");
    } finally {
      setLoading(false);
    }
  }, [enabled, query, user?.id]);

  useEffect(() => {
    if (!enabled) {
      setArticles([]);
      setTotal(0);
      setError(null);
      setLoading(false);
      return;
    }
    loadArticles();
  }, [enabled, loadArticles]);

  return {
    articles,
    total,
    loading,
    error,
    page: query.page,
    pageSize: resolvedPageSize,
    refetch: loadArticles,
  };
}

export const useArticleFilters = () => useFilterStore();

export const useArticleSearch = (delay = 350) => {
  const search = useFilterStore((state) => state.search ?? "");
  const setSearch = useFilterStore((state) => state.setSearch);
  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(value.trim());
    }, delay);
    return () => window.clearTimeout(timer);
  }, [value, delay, setSearch]);

  return { value, setValue, commit: () => setSearch(value.trim()) };
};
