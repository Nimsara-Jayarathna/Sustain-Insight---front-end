// src/context/contextBridge.ts
import { useAuthContext } from "./AuthContext";

let authRef: ReturnType<typeof useAuthContext> | null = null;

export const setAuthContextRef = (ctx: ReturnType<typeof useAuthContext>) => {
  authRef = ctx;
};

export const getAuthContext = () => authRef;
