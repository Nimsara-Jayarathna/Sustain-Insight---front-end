import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken) {
    console.debug("DEBUG → Found token:", storedToken);
    setToken(storedToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } else {
    console.debug("DEBUG → No token found");
  }
}, []);

const login = (jwt: string, userData?: { name: string }) => {
  console.debug("DEBUG → Saving token:", jwt);
  localStorage.setItem("token", jwt);
  setToken(jwt);
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }
};

const logout = () => {
  console.debug("DEBUG → Clearing token & user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setToken(null);
  setUser(null);
};

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
