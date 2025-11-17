import { useEffect, useState } from "react";
import type { Category } from "../types/content";
import { fetchCategories } from "../services/supabaseArticles";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        if (active) setCategories(data);
      } catch (err: any) {
        if (active) {
          setError(err.message ?? "Unable to load categories");
          setCategories([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
};
