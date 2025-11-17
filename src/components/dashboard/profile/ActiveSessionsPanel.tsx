import { useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../hooks/useAuth";
import ActionStatusOverlay from "../../ui/ActionStatusOverlay";

const formatDate = (value?: string | number | null) => {
  if (!value) return "Unknown";
  const date = typeof value === "string" ? new Date(value) : new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const detectDevice = () => {
  if (typeof navigator === "undefined") return { agent: "Unknown", platform: "" };
  return { agent: navigator.userAgent, platform: navigator.platform };
};

export default function ActiveSessionsPanel() {
  const { session, logout } = useAuth();
  const [overlay, setOverlay] = useState<null | { status: "saving" | "success" | "error"; message: string }>(null);

  const sessionDetails = useMemo(() => {
    if (!session) return null;
    return {
      createdAt: formatDate(session.user?.created_at ?? null),
      expiresAt: formatDate(session.expires_at ?? null),
      device: detectDevice(),
      ip: session?.user?.user_metadata?.last_sign_in_ip ?? "Hidden via RLS",
    };
  }, [session]);

  const signOutEverywhere = async () => {
    setOverlay({ status: "saving", message: "Signing out of every device..." });
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      setOverlay({ status: "error", message: error.message });
    } else {
      setOverlay({ status: "success", message: "Signed out everywhere" });
    }
  };

  const signOutThisDevice = async () => {
    setOverlay({ status: "saving", message: "Signing out..." });
    try {
      await logout();
      setOverlay({ status: "success", message: "Signed out" });
    } catch (err: any) {
      setOverlay({ status: "error", message: err.message ?? "Unable to sign out" });
    }
  };

  return (
    <section className="space-y-4">
      <header>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Active Session</h3>
        <p className="text-sm text-gray-500 dark:text-slate-300">
          Monitor the device currently connected to your Sustain Insight account. Use the controls below to revoke sessions instantly.
        </p>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {sessionDetails ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Device</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{sessionDetails.device.agent}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{sessionDetails.device.platform}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Signed in</p>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{sessionDetails.createdAt}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Expires</p>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{sessionDetails.expiresAt}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Network</p>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{sessionDetails.ip}</p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={signOutEverywhere}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200"
              >
                Sign out everywhere
              </button>
              <button
                type="button"
                onClick={signOutThisDevice}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Sign out of this device
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-slate-300">No active session detected.</p>
        )}
      </div>

      {overlay && (
        <ActionStatusOverlay
          status={overlay.status}
          message={overlay.message}
          onClose={() => setOverlay(null)}
        />
      )}
    </section>
  );
}
