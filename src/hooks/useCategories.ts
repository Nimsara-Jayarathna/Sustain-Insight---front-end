import { useEffect, useState } from "react";
import type { Category } from "../types/content";
import { fetchPreferenceCatalog } from "../services/api/preferences";

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
        const { categories: catalogCategories } = await fetchPreferenceCatalog();
        if (active) setCategories(catalogCategories);
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
