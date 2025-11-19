import { useCallback, useEffect, useState } from "react";
import type { Article } from "../types/content";
import { fetchBookmarks } from "../services/api/bookmarks";
import { useAuth } from "./useAuth";

export const useSavedArticles = (initialPageSize = 12) => {
  const { user, initialize } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await fetchBookmarks({ page });
      setArticles(result.data);
      setTotal(result.total);
      setPageSize(result.pageSize);
    } catch (err: any) {
      setError(err.message ?? "Unable to load saved articles");
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    load();
  }, [load, user?.id]);

  return {
    articles,
    total,
    page,
    pageSize,
    loading,
    error,
    setPage,
    refetch: load,
  };
};
