import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const SELECT_FIELDS =
  "id,title,summary,content,image_url,published_at,source,insight_count,article_categories:article_categories(categories(id,name))";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Missing Supabase environment configuration");
    }

    const client = createClient(supabaseUrl, serviceKey);
    const { data: settings } = await client
      .from("app_settings")
      .select("landing_article_count")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const limit = settings?.landing_article_count ?? 8;

    const { data: rows, error: articlesError } = await client
      .from("articles")
      .select(SELECT_FIELDS)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (articlesError) {
      return new Response(JSON.stringify({ error: articlesError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const articles = (rows ?? []).map((row) => ({
      id: String(row.id),
      title: row.title,
      summary: row.summary ?? null,
      content: row.content ?? null,
      imageUrl: row.image_url ?? null,
      publishedAt: row.published_at ?? null,
      sources: row.source ? [row.source] : [],
      insightCount: row.insight_count ?? 0,
      categories:
        row.article_categories
          ?.map((rel: any) => rel?.categories)
          .filter(Boolean)
          .map((category: any) => ({
            id: String(category?.id ?? ""),
            name: category?.name ?? "",
          })) ?? [],
    }));

    return new Response(JSON.stringify({ data: articles, limit }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
