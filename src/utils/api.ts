const backendURL = import.meta.env.VITE_BACKEND_URL;

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${backendURL}${endpoint}`, options);
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
};
