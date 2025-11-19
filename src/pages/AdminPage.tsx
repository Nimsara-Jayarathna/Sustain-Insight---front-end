import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

type AdminProfile = {
  id: string;
  full_name: string | null;
  role: "admin" | "user";
};

const ROLE_OPTIONS: AdminProfile["role"][] = ["admin", "user"];

const isRlsError = (message?: string) => {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return normalized.includes("row-level security") || normalized.includes("permission denied");
};

export default function AdminPage() {
  const { user, role } = useAuth();
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const canManage = useMemo(() => role === "admin" && !!user, [role, user]);

  useEffect(() => {
    if (!canManage) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("profiles").select("id,full_name,role").order("created_at", {
        ascending: false,
      });
      if (!active) return;
      if (error) {
        const message = isRlsError(error?.message)
          ? "You are not authorized to read profile roles."
          : error.message ?? "Unable to load profiles.";
        setError(message);
        setProfiles([]);
      } else {
        const sanitized =
          data?.map((profile) => ({
            id: profile.id,
            full_name: profile.full_name,
            role: (profile.role ?? "user") as AdminProfile["role"],
          })) ?? [];
        setProfiles(sanitized);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [canManage]);

  const updateRole = async (profileId: string, newRole: AdminProfile["role"]) => {
    setUpdating(profileId);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId);

    if (error) {
      const message = isRlsError(error?.message)
        ? "RLS blocked this change. Only admins can update other users."
        : error.message ?? "Unable to update role.";
      setError(message);
    } else {
      setProfiles((prev) => prev.map((profile) => (profile.id === profileId ? { ...profile, role: newRole } : profile)));
    }

    setUpdating(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900">
        <header className="border-b border-slate-200 pb-6 dark:border-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Role management</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Role assignments come straight from the `profiles` table. Because RLS guards every query, the client can
            never see or mutate data it is not allowed to touch.
          </p>
        </header>

        {!canManage && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            You do not have permission to view this page.
          </div>
        )}

        {canManage && (
          <div className="mt-8 space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {loading ? (
              <p className="text-sm text-slate-500">Loading profiles...</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  <thead className="bg-slate-100 text-left font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    <tr>
                      <th className="px-4 py-3">User ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {profiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{profile.id}</td>
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{profile.full_name || "Unnamed"}</td>
                        <td className="px-4 py-3">
                          <select
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            disabled={updating === profile.id || profile.id === user?.id}
                            value={profile.role}
                            onChange={(event) => updateRole(profile.id, event.target.value as AdminProfile["role"])}
                          >
                            {ROLE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
