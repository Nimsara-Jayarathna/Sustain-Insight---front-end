import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
};

type UpdatePayload = {
  userId: string;
  role: "admin" | "user";
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
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), { status: 500, headers: corsHeaders });
  }

  if (profileRow?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }

  if (req.method === "GET") {
    const { data, error } = await client
      .from("profiles")
      .select("id,full_name,role")
      .order("created_at", { ascending: false });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ data }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  if (req.method === "PUT") {
    let body: UpdatePayload;
    try {
      body = (await req.json()) as UpdatePayload;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
    }

    if (!body.userId || !body.role) {
      return new Response(JSON.stringify({ error: "userId and role are required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (body.userId === session.user.id) {
      return new Response(JSON.stringify({ error: "Cannot change your own role" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { error } = await client
      .from("profiles")
      .update({ role: body.role })
      .eq("id", body.userId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: corsHeaders,
  });
});
