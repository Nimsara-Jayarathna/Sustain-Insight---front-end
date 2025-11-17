import { useCallback, useEffect, useState } from "react";
import type { Article } from "../types/content";
import { fetchSavedArticles } from "../services/supabaseArticles";
import { useAuth } from "./useAuth";

export const useSavedArticles = (pageSize = 12) => {
  const { user, initialize } = useAuth();
  const [page, setPage] = useState(1);
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
      const result = await fetchSavedArticles(user.id, page, pageSize);
      setArticles(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message ?? "Unable to load saved articles");
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, user?.id]);

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
