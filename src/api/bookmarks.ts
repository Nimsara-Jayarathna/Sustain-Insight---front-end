import { apiFetch } from "../utils/api";

/**
 * Add a bookmark for the given article.
 * Backend: POST /api/bookmarks/{articleId}
 */
export async function addBookmark(articleId: number | string) {
  return apiFetch(`/api/bookmarks/${articleId}`, {
    method: "POST",
  });
}

/**
 * Remove a bookmark for the given article.
 * Backend: DELETE /api/bookmarks/{articleId}
 */
export async function removeBookmark(articleId: number | string) {
  return apiFetch(`/api/bookmarks/${articleId}`, {
    method: "DELETE",
  });
}

/**
 * Get paginated bookmarks for the current user.
 * Backend: GET /api/bookmarks?page=x&size=y
 */
export async function getBookmarks(page = 1, size = 10) {
  return apiFetch(`/api/bookmarks?page=${page}&size=${size}`, {
    method: "GET",
  });
}
