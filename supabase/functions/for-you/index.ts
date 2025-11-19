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

  const { data: settings } = await client
    .from("app_settings")
    .select("feed_page_size,feed_recent_hours")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const pageSize = settings?.feed_page_size ?? 12;
  const recentHours = settings?.feed_recent_hours ?? 24;

  const [{ data: prefs }, { data: saved }, { data: insights }] = await Promise.all([
    client.from("user_preferences").select("category_ids,source_ids").eq("user_id", session.user.id).maybeSingle(),
    client.from("saved_articles").select("article_id").eq("user_id", session.user.id),
    client.from("article_insights").select("article_id").eq("user_id", session.user.id),
  ]);

  const categoryIds = prefs?.category_ids ?? [];
  const sourceIds = prefs?.source_ids ?? [];
  const cutoff =
    recentHours > 0 ? new Date(Date.now() - recentHours * 3600 * 1000).toISOString() : null;

  const fromIdx = (page - 1) * pageSize;
  const toIdx = fromIdx + pageSize - 1;

  let query = client
    .from("articles")
    .select(
      "id,title,summary,content,image_url,published_at,source,insight_count,article_categories:article_categories(categories(id,name))",
      { count: "exact" },
    )
    .order("published_at", { ascending: false, nullsFirst: false });

  if (categoryIds.length) {
    query = query.contains("category_ids", categoryIds);
  }

  if (sourceIds.length) {
    query = query.in("source", sourceIds);
  }

  if (cutoff) {
    query = query.gte("published_at", cutoff);
  }

  const { data, count, error } = await query.range(fromIdx, toIdx);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const savedSet = new Set(saved?.map((row) => row.article_id));
  const insightSet = new Set(insights?.map((row) => row.article_id));
  const payload =
    data?.map((row) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      imageUrl: row.image_url,
      publishedAt: row.published_at,
      source: row.source,
      sources: row.source ? [row.source] : [],
      insightCount: row.insight_count ?? 0,
      categories: row.article_categories?.map((rel: any) => rel.categories) ?? [],
      bookmarked: savedSet.has(row.id),
      insighted: insightSet.has(row.id),
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
