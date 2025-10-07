import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api"; // Or wherever your api utility is

export function useArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ 1. Add a loading state

  useEffect(() => {
    async function fetchInitialArticles() {
      try {
        setIsLoading(true); // Ensure loading is true at the start
        // This endpoint might be different, adjust if needed (e.g., a "latest" endpoint)
        const data = await apiFetch("/api/public/articles/latest"); 
        setArticles(data || []);
      } catch (err) {
        console.error("Failed to fetch initial articles:", err);
      } finally {
        setIsLoading(false); // ✅ 2. Set loading to false when done
      }
    }
    fetchInitialArticles();
  }, []); // Runs once on mount

  return { articles, isLoading }; // ✅ 3. Return the loading state
}