import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    try {
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
    } catch (err) {
      console.error("Failed to parse stored user", err);
      // If parsing fails, clear the stored data to prevent a broken state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = (jwt: string, userData?: { firstName: string; lastName: string }) => {
    console.debug("DEBUG → Saving token:", jwt);
    localStorage.setItem("token", jwt);
    setToken(jwt);

    if (userData) {
      const userToStore = {
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
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
