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

  const params = new URL(req.url).searchParams;
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const pageSize = Math.max(1, Number(params.get("pageSize") ?? "12"));

  const fromIdx = (page - 1) * pageSize;
  const toIdx = fromIdx + pageSize - 1;

  const { data, count, error } = await client
    .from("saved_articles")
    .select(
      "id,created_at,article:articles(id,title,summary,content,image_url,published_at,source,insight_count,article_categories:article_categories(categories(id,name)))",
      { count: "exact" },
    )
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .range(fromIdx, toIdx);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const payload =
    data
      ?.filter((row) => row.article)
      .map((row: any) => ({
        id: row.article.id,
        title: row.article.title,
        summary: row.article.summary,
        content: row.article.content,
        imageUrl: row.article.image_url,
        publishedAt: row.article.published_at,
        source: row.article.source,
        sources: row.article.source ? [row.article.source] : [],
        insightCount: row.article.insight_count ?? 0,
        categories:
          row.article.article_categories?.map((rel: any) => rel.categories) ?? [],
        bookmarked: true,
        insighted: false,
      })) ?? [];

  return new Response(
    JSON.stringify({
      data: payload,
      total: count ?? payload.length,
      page,
      pageSize,
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } },
  );
});
