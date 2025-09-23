const backendURL = import.meta.env.VITE_BACKEND_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.debug("DEBUG → apiFetch sending request:", {
    url: `${backendURL}${endpoint}`,
    headers,
  });

  const res = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`DEBUG → API error ${res.status}: ${text}`);
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
};
