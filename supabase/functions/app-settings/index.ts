import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
};

type SettingsPayload = {
  id?: string | null;
  landing_article_count: number;
  feed_page_size: number;
  feed_recent_hours: number;
};

const DEFAULT_SETTINGS: SettingsPayload = {
  id: null,
  landing_article_count: 8,
  feed_page_size: 12,
  feed_recent_hours: 24,
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

  const { data: roleRow, error: roleError } = await client
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const isAdmin = roleRow?.role === "admin";
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  if (req.method === "GET") {
    const { data, error } = await client
      .from("app_settings")
      .select("id,landing_article_count,feed_page_size,feed_recent_hours")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify(data ?? DEFAULT_SETTINGS),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  if (req.method === "POST") {
    let payload: SettingsPayload;
    try {
      payload = (await req.json()) as SettingsPayload;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const record = {
      landing_article_count: payload.landing_article_count,
      feed_page_size: payload.feed_page_size,
      feed_recent_hours: payload.feed_recent_hours,
      updated_by: session.user.id,
    };

    if (payload.id) {
      const { data, error } = await client
        .from("app_settings")
        .update(record)
        .eq("id", payload.id)
        .select("id,landing_article_count,feed_page_size,feed_recent_hours")
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data, error } = await client
      .from("app_settings")
      .insert(record)
      .select("id,landing_article_count,feed_page_size,feed_recent_hours")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: corsHeaders,
  });
});
