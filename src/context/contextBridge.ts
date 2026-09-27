// src/context/contextBridge.ts
import type { AuthContextValue } from "./authContextValue";

let authRef: AuthContextValue | null = null;

export const setAuthContextRef = (ctx: AuthContextValue) => {
  authRef = ctx;
};

export const getAuthContext = () => authRef;
