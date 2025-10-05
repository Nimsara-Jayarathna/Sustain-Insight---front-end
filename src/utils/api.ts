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
    const errorText = await res.text();
    let errorMessage = errorText;
    try {
      const errData = JSON.parse(errorText);
      if (errData && errData.message) {
        errorMessage = errData.message;
      }
    } catch (e) {
      // Ignore parsing errors, we'll use the raw text
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
