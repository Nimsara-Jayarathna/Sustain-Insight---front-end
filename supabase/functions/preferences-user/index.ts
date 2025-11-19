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
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const { data: profileRow, error: profileError } = await client
    .from("user_profiles")
    .select("first_name,last_name,job_title")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const { data: prefsRow, error: prefsError } = await client
    .from("user_preferences")
    .select("category_ids,source_ids")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (profileError || prefsError) {
    return new Response(
      JSON.stringify({ error: profileError?.message ?? prefsError?.message ?? "Unable to fetch preferences" }),
      { status: 500, headers: corsHeaders },
    );
  }

  const metadataFirst = (session.user.user_metadata?.first_name ?? session.user.user_metadata?.firstName ?? "").trim();
  const metadataLast = (session.user.user_metadata?.last_name ?? session.user.user_metadata?.lastName ?? "").trim();

  return new Response(
    JSON.stringify({
      firstName: profileRow?.first_name?.trim() || metadataFirst || session.user.email?.split("@")[0] || "",
      lastName: profileRow?.last_name?.trim() || metadataLast,
      jobTitle: profileRow?.job_title ?? "",
      categoryIds: (prefsRow?.category_ids ?? []).map(String),
      sourceIds: (prefsRow?.source_ids ?? []).map(String),
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
