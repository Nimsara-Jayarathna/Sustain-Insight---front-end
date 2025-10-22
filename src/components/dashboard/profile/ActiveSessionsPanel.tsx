import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessions, logoutAllSessions, logoutSession } from "../../../api/sessions";
import type { RawSession } from "../../../api/sessions";
import { useAuthContext } from "../../../context/AuthContext";
import ActionStatusOverlay from "../../ui/ActionStatusOverlay";

type OverlayStatus = {
  status: "saving" | "success" | "error";
  message: string;
};

interface NormalizedSession {
  id: string;
  deviceLabel: string;
  ipAddress: string;
  lastActiveRaw: string | null;
  statusLabel: string;
  isActive: boolean;
  isCurrentDevice: boolean;
}

const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const formatRelativeTime = (timestamp: string | null): string | null => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(
        Math.round(duration),
        division.unit
      );
    }
    duration /= division.amount;
  }

  return null;
};

const formatAbsoluteTime = (timestamp: string | null): string | null => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const toTitleCase = (value: string): string =>
  value
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : ""))
    .join(" ");

const extractDevice = (session: RawSession) => {
  if (
    session.metadata &&
    typeof session.metadata.device === "object" &&
    session.metadata.device !== null
  ) {
    return session.metadata.device;
  }

  if (
    typeof session.device === "object" &&
    session.device !== null &&
    !Array.isArray(session.device)
  ) {
    return session.device;
  }

  if (
    session.deviceDetails &&
    typeof session.deviceDetails === "object" &&
    session.deviceDetails !== null
  ) {
    return session.deviceDetails;
  }

  if (
    session.deviceMeta &&
    typeof session.deviceMeta === "object" &&
    session.deviceMeta !== null
  ) {
    return session.deviceMeta;
  }

  if (
    session.deviceInfoDetails &&
    typeof session.deviceInfoDetails === "object" &&
    session.deviceInfoDetails !== null
  ) {
    return session.deviceInfoDetails;
  }

  if (
    session.deviceData &&
    typeof session.deviceData === "object" &&
    session.deviceData !== null
  ) {
    return session.deviceData;
  }

  return undefined;
};

const extractStatus = (session: RawSession) => {
  if (
    session.metadata &&
    typeof session.metadata.status === "object" &&
    session.metadata.status !== null
  ) {
    return session.metadata.status;
  }

  if (
    session.statusMeta &&
    typeof session.statusMeta === "object" &&
    session.statusMeta !== null
  ) {
    return session.statusMeta;
  }

  if (
    session.sessionStatus &&
    typeof session.sessionStatus === "object" &&
    session.sessionStatus !== null
  ) {
    return session.sessionStatus;
  }

  if (
    session.statusInfo &&
    typeof session.statusInfo === "object" &&
    session.statusInfo !== null
  ) {
    return session.statusInfo;
  }

  if (
    typeof session.status === "object" &&
    session.status !== null &&
    !Array.isArray(session.status)
  ) {
    return session.status as RawSession["statusMeta"];
  }

  return undefined;
};

const extractTimestamps = (session: RawSession) => {
  if (
    session.metadata &&
    typeof session.metadata.timestamps === "object" &&
    session.metadata.timestamps !== null
  ) {
    return session.metadata.timestamps;
  }

  if (
    session.timestamps &&
    typeof session.timestamps === "object" &&
    session.timestamps !== null
  ) {
    return session.timestamps;
  }

  return undefined;
};

const parseDeviceLabel = (session: RawSession): string => {
  const deviceRecord = extractDevice(session);

  const baseLabel =
    (typeof session.device === "string" ? session.device : "") ||
    session.deviceInfo ||
    session.userAgent ||
    session.browser ||
    deviceRecord?.name ||
    deviceRecord?.rawUserAgent ||
    "";

  if (!baseLabel) return "Unknown device";

  if (baseLabel.includes("(") && baseLabel.includes(")")) {
    return baseLabel.split("(")[0].trim();
  }

  if (baseLabel.includes("/")) {
    return baseLabel.split(" ")[0];
  }

  return baseLabel.length > 60 ? `${baseLabel.slice(0, 57)}...` : baseLabel;
};

const normalizeSession = (session: RawSession): NormalizedSession => {
  const deviceRecord = extractDevice(session);
  const statusRecord = extractStatus(session);
  const timestampRecord = extractTimestamps(session);

  const id =
    (session.id ?? session.sessionId ?? session._id ?? session.token) ||
    `session-${(session.device || session.deviceInfo || "unknown")
      .toString()
      .replace(/\s+/g, "-")}-${(session.ipAddress || session.ip || deviceRecord?.ipAddress || "unknown")
      .toString()
      .replace(/\s+/g, "-")}`;

  const statusRaw =
    typeof session.status === "string"
      ? session.status
      : typeof session.state === "string"
      ? session.state
      : typeof statusRecord?.status === "string"
      ? statusRecord.status
      : typeof statusRecord?.label === "string"
      ? statusRecord.label
      : typeof statusRecord?.value === "string"
      ? statusRecord.value
      : "";

  const activeFlag =
    typeof session.active === "boolean"
      ? session.active
      : typeof session.isActive === "boolean"
      ? session.isActive
      : typeof statusRecord?.active === "boolean"
      ? statusRecord.active
      : typeof statusRecord?.isActive === "boolean"
      ? statusRecord.isActive
      : statusRaw
      ? statusRaw.toLowerCase() === "active"
      : true;

  const statusLabel = statusRaw
    ? toTitleCase(statusRaw)
    : typeof statusRecord?.label === "string"
    ? statusRecord.label
    : activeFlag
    ? "Active"
    : "Inactive";

  return {
    id,
    deviceLabel: parseDeviceLabel(session),
    ipAddress: (
      session.ipAddress ??
      session.ip ??
      deviceRecord?.ipAddress ??
      deviceRecord?.ip ??
      "Unknown IP"
    ).toString(),
    lastActiveRaw:
      (session.lastActive ??
        session.lastActiveAt ??
        session.updatedAt ??
        session.createdAt ??
        timestampRecord?.lastActive ??
        timestampRecord?.lastActiveAt ??
        timestampRecord?.updatedAt ??
        timestampRecord?.createdAt) || null,
    statusLabel,
    isActive: Boolean(activeFlag),
    isCurrentDevice: Boolean(
      session.isCurrent ??
        session.current ??
        session.isCurrentDevice ??
        statusRecord?.current ??
        statusRecord?.isCurrent
    ),
  };
};

export const ActiveSessionsPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const [sessions, setSessions] = useState<NormalizedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAll, setProcessingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusOverlay, setStatusOverlay] = useState<OverlayStatus | null>(null);
  const handleOverlayClose = useCallback(() => setStatusOverlay(null), []);

  const handleSessionExpired = useCallback(async () => {
    setStatusOverlay(null);
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const fetchSessions = useCallback(
    async (options?: { silent?: boolean }) => {
      if (options?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const rawSessions = await getSessions();
        const normalizedSessions = rawSessions.map(normalizeSession);
        setSessions(normalizedSessions);
      } catch (err: any) {
        const message = err?.message || "Unable to load sessions.";
        if (message.toLowerCase().includes("session expired")) {
          await handleSessionExpired();
          return;
        }
        setError(message);
      } finally {
        if (options?.silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [handleSessionExpired]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleLogoutSession = useCallback(
    async (sessionId: string) => {
      setProcessingId(sessionId);
      setStatusOverlay({
        status: "saving",
        message: "Logging out the selected session…",
      });
      try {
        await logoutSession(sessionId);
        await fetchSessions({ silent: true });
        setStatusOverlay({
          status: "success",
          message: "Session logged out successfully.",
        });
      } catch (err: any) {
        const message = err?.message || "Failed to log out the session.";
        if (message.toLowerCase().includes("session expired")) {
          await handleSessionExpired();
          return;
        }
        setStatusOverlay({
          status: "error",
          message,
        });
      } finally {
        setProcessingId(null);
      }
    },
    [fetchSessions, handleSessionExpired]
  );

  const handleLogoutAll = useCallback(async () => {
    setProcessingAll(true);
    setStatusOverlay({
      status: "saving",
      message: "Logging out from all devices…",
    });
    try {
      await logoutAllSessions();
      await fetchSessions({ silent: true });
      setStatusOverlay({
        status: "success",
        message: "Logged out from all devices.",
      });
    } catch (err: any) {
      const message =
        err?.message || "Failed to log out from all active sessions.";
      if (message.toLowerCase().includes("session expired")) {
        await handleSessionExpired();
        return;
      }
      setStatusOverlay({
        status: "error",
        message,
      });
    } finally {
      setProcessingAll(false);
    }
  }, [fetchSessions, handleSessionExpired]);

  const hasSessions = sessions.length > 0;

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-48 rounded bg-gray-200 dark:bg-slate-800" />
                  <div className="h-3 w-32 rounded bg-gray-200 dark:bg-slate-800" />
                </div>
                <div className="h-8 w-32 rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/50 dark:bg-red-500/10 dark:text-red-200">
          <p className="mb-3">{error}</p>
          <button
            type="button"
            onClick={() => fetchSessions()}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!hasSessions) {
      return (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No other active sessions found.
        </div>
      );
    }

    return (
      <ul className="space-y-4">
        {sessions.map((session) => {
          const relative = formatRelativeTime(session.lastActiveRaw);
          const absolute = formatAbsoluteTime(session.lastActiveRaw);

          return (
            <li
              key={session.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-400"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      {session.deviceLabel}
                    </h4>
                    {session.isCurrentDevice && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">
                    IP address:{" "}
                    <span className="font-medium text-gray-700 dark:text-slate-200">
                      {session.ipAddress}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-400">
                    Last active{" "}
                    {relative ?? "time unavailable"}
                    {absolute ? ` • ${absolute}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      session.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {session.statusLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLogoutSession(session.id)}
                    disabled={processingId === session.id || processingAll}
                    className="inline-flex w-full items-center justify-center rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-500/10 sm:w-auto"
                  >
                    {processingId === session.id ? "Logging out…" : "Log out"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }, [
    loading,
    error,
    hasSessions,
    sessions,
    processingId,
    processingAll,
    handleLogoutSession,
    fetchSessions,
  ]);

  const summaryBlock = useMemo(() => {
    if (loading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`summary-skeleton-${index}`}
              className="h-24 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-full flex-col justify-between animate-pulse space-y-2">
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-2 w-24 rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!hasSessions) return null;

    const activeCount = sessions.filter((session) => session.isActive).length;
    const currentDevice = sessions.find((session) => session.isCurrentDevice);

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Active sessions</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Includes all devices currently signed in to your account.
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Current device</p>
          <p className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-100">
            {currentDevice ? currentDevice.deviceLabel : "Not detected"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            {currentDevice
              ? `Signed in from ${currentDevice.ipAddress}.`
              : "We will highlight your current device when available."}
          </p>
        </div>
      </div>
    );
  }, [loading, hasSessions, sessions]);

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Active Sessions
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
              Review devices currently signed in and log out any you don’t
              recognize.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {refreshing && !loading && (
              <span className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-400">
                <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500 dark:bg-emerald-300" />
                Refreshing…
              </span>
            )}
            <button
              type="button"
              onClick={handleLogoutAll}
              disabled={!hasSessions || processingAll || loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {processingAll ? "Logging out…" : "Log out from all devices"}
            </button>
          </div>
        </div>

      <div className="mt-6 space-y-6">
        {summaryBlock}
        {content}
      </div>
      </section>
      {statusOverlay && (
        <ActionStatusOverlay
          status={statusOverlay.status}
          message={statusOverlay.message}
          onClose={handleOverlayClose}
        />
      )}
    </>
  );
};

export default ActiveSessionsPanel;
