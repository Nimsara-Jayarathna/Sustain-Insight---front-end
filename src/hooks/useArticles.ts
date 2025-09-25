import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export const useArticles = (limit = 3) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiFetch(`/api/public/articles/latest?limit=${limit}`);
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [limit]);

  return { articles, loading };
};
