import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const client = createClient(supabaseUrl, serviceKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  const { data: session, error: sessionError } = await client.auth.getUser();
  if (sessionError || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const [{ data: profile, error: profileError }, { data: legacy, error: legacyError }] = await Promise.all([
    client.from("profiles").select("full_name,role").eq("id", session.user.id).maybeSingle(),
    client.from("user_profiles").select("first_name,last_name").eq("user_id", session.user.id).maybeSingle(),
  ]);

  if (profileError || legacyError) {
    return new Response(JSON.stringify({ error: profileError?.message ?? legacyError?.message ?? "Failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const fallbackEmail = session.user.email ?? "";
  const profileName = profile?.full_name?.trim() ?? "";
  const profileRole = profile?.role ?? null;

  const profileFirstRaw = profileName.split(" ").filter(Boolean);
  const profileFirst = profileFirstRaw[0] ?? "";
  const profileLast = profileFirstRaw.slice(1).join(" ");

  const legacyFirst = (legacy?.first_name ?? "").trim();
  const legacyLast = (legacy?.last_name ?? "").trim();

  const fallbackFirst = (session.user.user_metadata?.first_name ?? session.user.user_metadata?.firstName ?? "").trim();
  const fallbackLast = (session.user.user_metadata?.last_name ?? session.user.user_metadata?.lastName ?? "").trim();

  const firstName =
    legacyFirst ||
    profileFirst ||
    fallbackFirst ||
    (fallbackEmail ? fallbackEmail.split("@")[0] : "");
  const lastName = legacyLast || profileLast || fallbackLast;
  const fullName = `${firstName} ${lastName}`.trim() || profileName || fallbackEmail;

  return new Response(
    JSON.stringify({
      firstName,
      lastName,
      fullName,
      role: profileRole,
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
