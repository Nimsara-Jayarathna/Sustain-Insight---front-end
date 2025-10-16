// src/utils/errorHandler.ts
/**
 * Normalize backend or network errors into a clean message.
 * Used globally by apiFetch, useAuthHandlers, and all data hooks.
 */
export function extractErrorMessage(err: unknown): string {
  // 🧩 1️⃣ Network or native JS error (e.g. fetch failed)
  if (err instanceof TypeError) {
    return "Network error. Please check your connection.";
  }

  // 🧩 2️⃣ Custom Error object (already normalized)
  if (err instanceof Error && err.message) {
    // Common safe fallbacks for backend-thrown text
    if (err.message.startsWith("{") && err.message.includes("message")) {
      try {
        const parsed = JSON.parse(err.message);
        return parsed.message || "Unexpected error occurred.";
      } catch {
        return err.message;
      }
    }
    return err.message;
  }

  // 🧩 3️⃣ Raw backend JSON (string or object)
  if (typeof err === "string") {
    try {
      const parsed = JSON.parse(err);
      return parsed.message || parsed.error || "Unexpected error occurred.";
    } catch {
      return err; // plain string fallback
    }
  }

  if (typeof err === "object" && err !== null) {
    const anyErr = err as Record<string, any>;
    return (
      anyErr.message ||
      anyErr.error_description ||
      anyErr.error ||
      "Unexpected error occurred."
    );
  }

  // 🧩 4️⃣ Final fallback
  return "An unexpected error occurred.";
}
