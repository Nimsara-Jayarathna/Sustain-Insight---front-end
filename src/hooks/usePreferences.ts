// src/hooks/usePreferences.ts
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export interface Category {
  id: number;
  name: string;
}

export interface Source {
  id: number;
  name: string;
}

export function usePreferences() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setCategories(cats);
        setSources(srcs);
      } catch {
        setCategories([]);
        setSources([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { categories, sources, loading };
}
