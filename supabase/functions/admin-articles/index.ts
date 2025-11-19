import { serve } from "https://deno.land/std/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST, PUT, DELETE",
};

type ArticlePayload = {
  id?: string;
  title?: string;
  summary?: string | null;
  content?: string | null;
  source?: string | null;
  sourceId?: string | null;
  categoryIds?: string[];
  publishedAt?: string | null;
  imageUrl?: string | null;
};

type AdminArticleRecord = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  source?: string | null;
  source_id?: string | null;
  published_at?: string | null;
  insight_count?: number | null;
  category_ids?: string[] | null;
  image_url?: string | null;
};

type PreviewArticle = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  source?: string | null;
  sources: string[];
  insightCount: number;
  categories: { id: string; name: string | null }[];
};

const mapAdminRecord = (row: any): AdminArticleRecord => ({
  id: String(row.id),
  title: row.title,
  summary: row.summary ?? null,
  content: row.content ?? null,
  source: row.source ?? null,
  source_id: row.source_id ?? null,
  published_at: row.published_at ?? null,
  insight_count: row.insight_count ?? null,
  category_ids: Array.isArray(row.category_ids) ? row.category_ids.map((value: any) => String(value)) : [],
  image_url: row.image_url ?? null,
});

const mapPreviewRecord = (row: any): PreviewArticle => ({
  id: String(row.id),
  title: row.title,
  summary: row.summary ?? null,
  content: row.content ?? null,
  imageUrl: row.image_url ?? null,
  publishedAt: row.published_at ?? null,
  source: row.source ?? null,
  sources: row.source ? [row.source] : [],
  insightCount: row.insight_count ?? 0,
  categories:
    row.article_categories
      ?.map((rel: any) => rel?.categories)
      .filter(Boolean)
      .map((category: any) => ({
        id: String(category.id),
        name: category.name ?? null,
      })) ?? [],
});

const respond = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
    ...init,
  });

const syncArticleCategories = async (
  client: ReturnType<typeof createClient>,
  articleId: string,
  categoryIds: string[],
) => {
  const { error: deleteError } = await client.from("article_categories").delete().eq("article_id", articleId);
  if (deleteError) throw deleteError;
  if (!categoryIds.length) return;
  const rows = categoryIds.map((categoryId) => ({
    article_id: articleId,
    category_id: categoryId,
  }));
  const { error: insertError } = await client.from("article_categories").insert(rows);
  if (insertError) throw insertError;
};

const fetchInsightsDetail = async (client: ReturnType<typeof createClient>, articleId: string) => {
  const { data, error } = await client
    .from("article_insights")
    .select("id,created_at,user_id")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)));
  let profileMap: Record<string, string | null> = {};
  if (userIds.length) {
    const { data: profiles, error: profileError } = await client
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);
    if (profileError) throw profileError;
    profileMap =
      profiles?.reduce<Record<string, string | null>>((acc, profile) => {
        acc[profile.id as string] = profile.full_name ?? null;
        return acc;
      }, {}) ?? {};
  }
  return rows.map((row) => ({
    id: row.id as number,
    userId: row.user_id as string,
    fullName: profileMap[row.user_id as string] ?? null,
    createdAt: row.created_at as string,
  }));
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
    return respond({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: roleRow, error: roleError } = await client
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();
  if (roleError) {
    return respond({ error: roleError.message }, { status: 500 });
  }
  if (roleRow?.role !== "admin") {
    return respond({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const articleId = url.searchParams.get("id") ?? url.searchParams.get("articleId");

  if (req.method === "GET") {
    if (mode === "preview") {
      if (!articleId) {
        return respond({ error: "Article id is required for preview" }, { status: 400 });
      }
      const { data, error } = await client
        .from("articles")
        .select(
          "id,title,summary,content,image_url,published_at,source,insight_count,article_categories:article_categories(categories(id,name))",
        )
        .eq("id", articleId)
        .maybeSingle();
      if (error) {
        return respond({ error: error.message }, { status: 500 });
      }
      if (!data) {
        return respond({ error: "Article not found" }, { status: 404 });
      }
      return respond(mapPreviewRecord(data));
    }

    if (mode === "insights") {
      if (!articleId) {
        return respond({ error: "Article id is required for insights" }, { status: 400 });
      }
      try {
        const insights = await fetchInsightsDetail(client, articleId);
        return respond({ data: insights });
      } catch (error: any) {
        return respond({ error: error?.message ?? "Unable to load insights" }, { status: 500 });
      }
    }

    if (articleId) {
      const { data, error } = await client
        .from("articles")
        .select("id,title,summary,content,source,source_id,published_at,insight_count,category_ids,image_url")
        .eq("id", articleId)
        .maybeSingle();
      if (error) {
        return respond({ error: error.message }, { status: 500 });
      }
      if (!data) {
        return respond({ error: "Article not found" }, { status: 404 });
      }
      return respond(mapAdminRecord(data));
    }

    const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? "200")));
    const { data, error } = await client
      .from("articles")
      .select("id,title,summary,content,source,source_id,published_at,insight_count,category_ids,image_url")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) {
      return respond({ error: error.message }, { status: 500 });
    }
    const payload = (data ?? []).map(mapAdminRecord);
    return respond({ data: payload });
  }

  if (req.method === "POST") {
    let body: ArticlePayload;
    try {
      body = (await req.json()) as ArticlePayload;
    } catch {
      return respond({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body.title?.trim()) {
      return respond({ error: "Title is required" }, { status: 400 });
    }
    const record = {
      title: body.title.trim(),
      summary: body.summary ?? null,
      content: body.content ?? null,
      source: body.source ?? null,
      source_id: body.sourceId ?? null,
      published_at: body.publishedAt ?? null,
      category_ids: Array.isArray(body.categoryIds) ? body.categoryIds : [],
      image_url: body.imageUrl ?? null,
    };
    const { data, error } = await client
      .from("articles")
      .insert(record)
      .select("id,title,summary,content,source,source_id,published_at,insight_count,category_ids,image_url")
      .single();
    if (error) {
      return respond({ error: error.message }, { status: 500 });
    }
    try {
      await syncArticleCategories(client, String(data.id), record.category_ids ?? []);
    } catch (syncError: any) {
      return respond({ error: syncError?.message ?? "Failed to sync categories" }, { status: 500 });
    }
    return respond({ data: mapAdminRecord(data) }, { status: 201 });
  }

  if (req.method === "PUT") {
    let body: ArticlePayload;
    try {
      body = (await req.json()) as ArticlePayload;
    } catch {
      return respond({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body.id) {
      return respond({ error: "Article id is required" }, { status: 400 });
    }
    if (!body.title?.trim()) {
      return respond({ error: "Title is required" }, { status: 400 });
    }
    const record = {
      title: body.title.trim(),
      summary: body.summary ?? null,
      content: body.content ?? null,
      source: body.source ?? null,
      source_id: body.sourceId ?? null,
      published_at: body.publishedAt ?? null,
      category_ids: Array.isArray(body.categoryIds) ? body.categoryIds : [],
      image_url: body.imageUrl ?? null,
    };
    const { data, error } = await client
      .from("articles")
      .update(record)
      .eq("id", body.id)
      .select("id,title,summary,content,source,source_id,published_at,insight_count,category_ids,image_url")
      .single();
    if (error) {
      return respond({ error: error.message }, { status: 500 });
    }
    try {
      await syncArticleCategories(client, body.id, record.category_ids ?? []);
    } catch (syncError: any) {
      return respond({ error: syncError?.message ?? "Failed to sync categories" }, { status: 500 });
    }
    return respond({ data: mapAdminRecord(data) });
  }

  if (req.method === "DELETE") {
    if (!articleId) {
      return respond({ error: "Article id is required" }, { status: 400 });
    }
    const { error } = await client.from("articles").delete().eq("id", articleId);
    if (error) {
      return respond({ error: error.message }, { status: 500 });
    }
    return respond({ success: true });
  }

  return respond({ error: "Method Not Allowed" }, { status: 405 });
});
