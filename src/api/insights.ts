// src/api/insights.ts
import { apiFetch } from "../utils/api";

// ✅ Add an insight
export const addInsight = (articleId: number | string) =>
  apiFetch(`/api/insights/${articleId}`, { method: "POST" });

// ✅ Remove an insight
export const removeInsight = (articleId: number | string) =>
  apiFetch(`/api/insights/${articleId}`, { method: "DELETE" });

// ✅ Get total insight count for an article
export const getInsightCount = (articleId: number | string): Promise<number> =>
  apiFetch(`/api/insights/${articleId}/count`);

// ✅ Check if the current user has insighted this article
export const isInsighted = (articleId: number | string): Promise<boolean> =>
  apiFetch(`/api/insights/${articleId}/me`);
