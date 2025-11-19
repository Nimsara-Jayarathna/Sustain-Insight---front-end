import { useEffect, useState } from "react";
import type { Category, Source } from "../types/content";
import { fetchPreferenceCatalog } from "../services/api/preferences";

export function usePreferences() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { categories: cats, sources: srcs } = await fetchPreferenceCatalog();
        if (!isMounted) return;
        setCategories(cats);
        setSources(srcs);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message ?? "Unable to load preferences");
        setCategories([]);
        setSources([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, sources, loading, error };
}
