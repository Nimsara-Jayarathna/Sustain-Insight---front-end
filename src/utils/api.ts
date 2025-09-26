const backendURL = import.meta.env.VITE_BACKEND_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // attach token if not auth endpoint
  if (token && !endpoint.startsWith("/api/auth")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.debug("DEBUG → Fetching:", `${backendURL}${endpoint}`, { headers });

  const res = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
};
