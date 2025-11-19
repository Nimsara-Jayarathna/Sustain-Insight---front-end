import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
};

type Payload = {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  categoryIds?: string[];
  sourceIds?: string[];
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
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

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const updates: Payload = {
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    jobTitle: body.jobTitle?.trim(),
    categoryIds: body.categoryIds ?? [],
    sourceIds: body.sourceIds ?? [],
  };

  const profilePromise = client
    .from("user_profiles")
    .upsert(
      {
        user_id: session.user.id,
        first_name: updates.firstName ?? null,
        last_name: updates.lastName ?? null,
        job_title: updates.jobTitle ?? null,
      },
      { onConflict: "user_id" },
    );

  const prefsPromise = client
    .from("user_preferences")
    .upsert(
      {
        user_id: session.user.id,
        category_ids: updates.categoryIds ?? [],
        source_ids: updates.sourceIds ?? [],
      },
      { onConflict: "user_id" },
    );

  const [{ error: profileError }, { error: prefsError }] = await Promise.all([profilePromise, prefsPromise]);
  if (profileError || prefsError) {
    return new Response(JSON.stringify({ error: profileError?.message ?? prefsError?.message ?? "Update failed" }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
