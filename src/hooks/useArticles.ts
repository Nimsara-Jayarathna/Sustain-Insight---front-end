// useArticles.ts (updated)
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export const useArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // ✅ No more limit param here, backend enforces defaults
        const data = await apiFetch(`/api/public/articles/latest`);
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return { articles, loading };
};
