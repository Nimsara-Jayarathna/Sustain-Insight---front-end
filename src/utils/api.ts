const backendURL = import.meta.env.VITE_BACKEND_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach token if not auth endpoint
  if (token && !endpoint.startsWith("/api/auth")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.debug("DEBUG → Fetching:", `${backendURL}${endpoint}`, { headers });

  const res = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-2xx responses
  if (!res.ok) {
    const errorText = await res.text();

    // Separate try-block so our custom throw isn't recaptured
    let errMessage = errorText;

    try {
      const errData = JSON.parse(errorText);

      // ✅ Special detection block (returns early)
      if (errData?.error === "EMAIL_NOT_VERIFIED") {
        const err: any = new Error(errData.message || "Your email has not been verified.");
        err.code = "EMAIL_NOT_VERIFIED";
        throw err; // ⬅️ exits function entirely
      }

      errMessage = errData?.message || errorText || "Request failed.";
    } catch {
      // if parsing fails, just keep errorText
    }

    // ✅ For all other cases, throw simple clean error like before
    throw new Error(errMessage);
  }

  return res.json();
};
