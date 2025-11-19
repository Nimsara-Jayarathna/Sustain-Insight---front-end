import { supabase } from "../lib/supabaseClient";
import type { Category, Source } from "../types/content";

export type ArticleFormValues = {
  title: string;
  summary?: string;
  content?: string;
  source?: string | null;
  sourceId?: string | null;
  categoryIds: string[];
  publishedAt?: string | null;
  imageUrl?: string | null;
};

export type AdminArticleRecord = {
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

export type ArticleInsightDetail = {
  id: number;
  userId: string;
  fullName: string | null;
  createdAt: string;
};

export type AppSettingsRecord = {
  id: string | null;
  landing_article_count: number;
  feed_page_size: number;
  feed_recent_hours: number;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const syncArticleCategories = async (articleId: string, categoryIds: string[]) => {
  await supabase.from("article_categories").delete().eq("article_id", articleId);
  if (categoryIds.length === 0) return;
  await supabase
    .from("article_categories")
    .insert(categoryIds.map((categoryId) => ({ article_id: articleId, category_id: categoryId })));
};

export const fetchAdminArticles = async (): Promise<AdminArticleRecord[]> => {
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,summary,content,source,source_id,published_at,insight_count,category_ids,image_url")
    .order("published_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
};

export const createAdminArticle = async (values: ArticleFormValues): Promise<string> => {
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: values.title,
      summary: values.summary ?? null,
      content: values.content ?? null,
      source: values.source ?? null,
      source_id: values.sourceId ?? null,
      published_at: values.publishedAt ?? null,
      category_ids: values.categoryIds ?? [],
      image_url: values.imageUrl ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  const articleId = data?.id as string;
  await syncArticleCategories(articleId, values.categoryIds ?? []);
  return articleId;
};

export const updateAdminArticle = async (articleId: string, values: ArticleFormValues) => {
  const { error } = await supabase
    .from("articles")
    .update({
      title: values.title,
      summary: values.summary ?? null,
      content: values.content ?? null,
      source: values.source ?? null,
      source_id: values.sourceId ?? null,
      published_at: values.publishedAt ?? null,
      category_ids: values.categoryIds ?? [],
      image_url: values.imageUrl ?? null,
    })
    .eq("id", articleId);
  if (error) throw error;
  await syncArticleCategories(articleId, values.categoryIds ?? []);
};

export const deleteAdminArticle = async (articleId: string) => {
  const { error } = await supabase.from("articles").delete().eq("id", articleId);
  if (error) throw error;
};

export const fetchArticleInsightsDetail = async (articleId: string): Promise<ArticleInsightDetail[]> => {
  const { data, error } = await supabase
    .from("article_insights")
    .select("id,created_at,user_id")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)));
  let profileMap: Record<string, string | null> = {};
  if (userIds.length > 0) {
    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);
    if (profileError && profileError.code !== "PGRST116") throw profileError;
    profileMap =
      profileRows?.reduce<Record<string, string | null>>((acc, profile) => {
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

export const createCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug: slugify(name),
    })
    .select("id,name,slug")
    .single();
  if (error) throw error;
  return {
    id: String(data.id),
    name: data.name,
    slug: data.slug ?? null,
  };
};

export const deleteCategory = async (categoryId: string) => {
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;
};

export const createSource = async (name: string): Promise<Source> => {
  const { data, error } = await supabase
    .from("sources")
    .insert({
      name,
      slug: slugify(name),
    })
    .select("id,name,slug")
    .single();
  if (error) throw error;
  return {
    id: String(data.id),
    name: data.name,
    slug: data.slug ?? null,
  };
};

export const deleteSource = async (sourceId: string) => {
  const { error } = await supabase.from("sources").delete().eq("id", sourceId);
  if (error) throw error;
};

export const fetchAppSettings = async (): Promise<AppSettingsRecord> => {
  const { data, error } = await supabase
    .from("app_settings")
    .select("id,landing_article_count,feed_page_size,feed_recent_hours")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return (
    data ?? {
      id: null,
      landing_article_count: 8,
      feed_page_size: 12,
      feed_recent_hours: 24,
    }
  );
};

export const saveAppSettings = async (
  values: AppSettingsRecord & { updatedBy?: string | null },
): Promise<AppSettingsRecord> => {
  if (values.id) {
    const { data, error } = await supabase
      .from("app_settings")
      .update({
        landing_article_count: values.landing_article_count,
        feed_page_size: values.feed_page_size,
        feed_recent_hours: values.feed_recent_hours,
        updated_by: values.updatedBy ?? null,
      })
      .eq("id", values.id)
      .select("id,landing_article_count,feed_page_size,feed_recent_hours")
      .single();
    if (error) throw error;
    return {
      id: data.id as string,
      landing_article_count: data.landing_article_count ?? values.landing_article_count,
      feed_page_size: data.feed_page_size ?? values.feed_page_size,
      feed_recent_hours: data.feed_recent_hours ?? values.feed_recent_hours,
    };
  }

  const { data, error } = await supabase
    .from("app_settings")
    .insert({
      landing_article_count: values.landing_article_count,
      feed_page_size: values.feed_page_size,
      feed_recent_hours: values.feed_recent_hours,
      updated_by: values.updatedBy ?? null,
    })
    .select("id,landing_article_count,feed_page_size,feed_recent_hours")
    .single();
  if (error) throw error;
  return {
    id: data.id as string,
    landing_article_count: data.landing_article_count ?? values.landing_article_count,
    feed_page_size: data.feed_page_size ?? values.feed_page_size,
    feed_recent_hours: data.feed_recent_hours ?? values.feed_recent_hours,
  };
};
