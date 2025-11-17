import { useCallback, useEffect, useMemo, useState } from "react";
import type { Article } from "../types/content";
import { fetchArticles, fetchLatestArticles } from "../services/supabaseArticles";
import type { ArticleFilters } from "../types/content";
import { useAuth } from "./useAuth";
import { useFilterStore } from "../stores/filterStore";

type UseArticlesOptions = Partial<ArticleFilters> & {
  page?: number;
  pageSize?: number;
  latest?: boolean;
};

export function useArticles(options?: UseArticlesOptions) {
  const { user, initialize } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  const optionsKey = JSON.stringify(options ?? {});
  const normalizedOptions = useMemo(() => options ?? {}, [optionsKey]);

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
      userId: user?.id,
    }),
    [normalizedOptions, user?.id],
  );

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (query.latest) {
        const latest = await fetchLatestArticles(query.pageSize, user?.id ?? undefined);
        setArticles(latest);
        setTotal(latest.length);
      } else {
        const result = await fetchArticles(query);
        setArticles(result.data);
        setTotal(result.total);
      }
    } catch (err: any) {
      setArticles([]);
      setTotal(0);
      setError(err.message ?? "Unable to load articles");
    } finally {
      setLoading(false);
    }
  }, [query, user?.id]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return {
    articles,
    total,
    loading,
    error,
    page: query.page,
    pageSize: query.pageSize,
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
