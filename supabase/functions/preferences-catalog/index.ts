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

  const [{ data: categories, error: categoryError }, { data: sources, error: sourceError }] = await Promise.all([
    client.from("categories").select("id,name,slug").order("name"),
    client.from("sources").select("id,name,slug").order("name"),
  ]);

  if (categoryError || sourceError) {
    return new Response(
      JSON.stringify({ error: categoryError?.message ?? sourceError?.message ?? "Unable to fetch catalog" }),
      { status: 500, headers: corsHeaders },
    );
  }

  return new Response(
    JSON.stringify({
      categories: (categories ?? []).map((category) => ({
        id: String(category.id),
        name: category.name,
        slug: category.slug ?? null,
      })),
      sources: (sources ?? []).map((source) => ({
        id: String(source.id),
        name: source.name,
        slug: source.slug ?? null,
      })),
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
