import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST, DELETE",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

  if (roleRow?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  if (req.method === "POST") {
    let payload: { name?: string } | null = null;
    try {
      payload = (await req.json()) as { name?: string } | null;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const name = payload?.name?.trim();
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data, error } = await client
      .from("categories")
      .insert({
        name,
        slug: slugify(name),
      })
      .select("id,name,slug")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        id: String(data.id),
        name: data.name,
        slug: data.slug ?? null,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  if (req.method === "DELETE") {
    const params = new URL(req.url).searchParams;
    const categoryId = params.get("id");
    if (!categoryId) {
      return new Response(JSON.stringify({ error: "Category id is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { error } = await client.from("categories").delete().eq("id", categoryId);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
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
