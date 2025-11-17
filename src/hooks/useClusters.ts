import { useEffect, useState } from "react";
import type { Cluster } from "../types/content";
import { fetchClusters } from "../services/supabaseArticles";

export const useClusters = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClusters();
        if (active) setClusters(data);
      } catch (err: any) {
        if (active) {
          setError(err.message ?? "Unable to load clusters");
          setClusters([]);
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

  return { clusters, loading, error };
};
