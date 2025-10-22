// src/api/sessions.ts
import { apiFetch } from "../utils/api";

export interface RawSessionDevice {
  name?: string;
  rawUserAgent?: string;
  userAgent?: string;
  ipAddress?: string;
  ip?: string;
  location?: string;
}

export interface RawSessionTimestamps {
  createdAt?: string;
  lastActiveAt?: string;
  lastActive?: string;
  updatedAt?: string;
  expiresAt?: string;
}

export interface RawSessionStatus {
  status?: string;
  label?: string;
  value?: string;
  active?: boolean;
  current?: boolean;
  isActive?: boolean;
  isCurrent?: boolean;
}

export interface RawSession {
  id?: string;
  sessionId?: string;
  _id?: string;
  device?: string;
  deviceInfo?: string;
  userAgent?: string;
  browser?: string;
  ipAddress?: string;
  ip?: string;
  lastActive?: string;
  lastActiveAt?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: string;
  state?: string;
  isActive?: boolean;
  active?: boolean;
  isCurrent?: boolean;
  current?: boolean;
  isCurrentDevice?: boolean;
  token?: string;
  expiresAt?: string;
  deviceDetails?: RawSessionDevice;
  deviceMeta?: RawSessionDevice;
  deviceInfoDetails?: RawSessionDevice;
  timestamps?: RawSessionTimestamps;
  statusMeta?: RawSessionStatus;
  sessionStatus?: RawSessionStatus;
  deviceData?: RawSessionDevice;
  statusInfo?: RawSessionStatus;
  metadata?: {
    device?: RawSessionDevice;
    timestamps?: RawSessionTimestamps;
    status?: RawSessionStatus;
  };
  [key: string]: unknown;
}

export const getSessions = async (): Promise<RawSession[]> => {
  try {
    const response = await apiFetch("/api/sessions", {
      method: "GET",
    });

    if (Array.isArray(response)) return response;
    if (Array.isArray((response as { sessions?: RawSession[] }).sessions)) {
      return (response as { sessions: RawSession[] }).sessions;
    }

    return [];
  } catch (error) {
    throw error;
  }
};

export const logoutSession = async (sessionId: string) => {
  try {
    await apiFetch(`/api/sessions/${sessionId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw error;
  }
};

export const logoutAllSessions = async () => {
  try {
    await apiFetch("/api/sessions/all", {
      method: "DELETE",
    });
  } catch (error) {
    throw error;
  }
};
