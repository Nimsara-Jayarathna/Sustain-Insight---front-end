import { supabase } from "../lib/supabaseClient";
import type {
  Article,
  ArticleFilters,
  Category,
  Cluster,
  PaginatedResult,
} from "../types/content";

type ArticleQuery = ArticleFilters & {
  page: number;
  pageSize: number;
  userId?: string;
};

const defaultPagination = {
  page: 1,
  pageSize: 12,
};

const mapCategories = (row: any): Category[] => {
  if (!row) return [];
  if (Array.isArray(row.categories)) {
    return row.categories.map((category: any) => ({
      id: String(category?.id ?? ""),
      name: category?.name ?? "",
    }));
  }
  if (Array.isArray(row.article_categories)) {
    return row.article_categories
      .map((relation: any) => relation?.categories)
      .filter(Boolean)
      .map((category: any) => ({
        id: String(category?.id ?? ""),
        name: category?.name ?? "",
      }));
  }
  return [];
};

const mapCluster = (row: any): Cluster | null => {
  if (!row) return null;
  if (row.cluster) {
    return {
      id: String(row.cluster.id ?? ""),
      name: row.cluster.name ?? "",
      description: row.cluster.description ?? null,
    };
  }
  if (row.clusters) {
    return {
      id: String(row.clusters.id ?? ""),
      name: row.clusters.name ?? "",
      description: row.clusters.description ?? null,
    };
  }
  return null;
};

const mapArticle = (record: any, savedIds?: Set<string>, insightIds?: Set<string>): Article => {
  if (!record) {
    throw new Error("Article record is undefined");
  }
  const imagePath: string | null = record?.image_path ?? null;
  const storageUrl = imagePath ? getPublicImageUrl(imagePath) : null;
  return {
    id: String(record.id),
    title: record.title,
    summary: record.summary ?? record.excerpt ?? null,
    content: record.content ?? null,
    imageUrl: record.image_url ?? storageUrl,
    publishedAt: record.published_at ?? record.created_at ?? null,
    sources: record.source ? [record.source] : record.sources ?? [],
    categories: mapCategories(record),
    cluster: mapCluster(record),
    bookmarked: savedIds ? savedIds.has(String(record.id)) : undefined,
    insighted: insightIds ? insightIds.has(String(record.id)) : undefined,
    insightCount: record.insight_count ?? record.engagement_count ?? 0,
  };
};

export const fetchArticleContent = async (articleId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("articles")
    .select("content")
    .eq("id", articleId)
    .maybeSingle();
  if (error) throw error;
  return data?.content ?? null;
};

const buildArticleQuery = (filters: ArticleQuery) => {
  const { sort, search, categories, sources, dateFrom, dateTo } = filters;

  let query = supabase
    .from("articles")
    .select(
      `id,title,summary,content,image_url,image_path,published_at,source,insight_count,cluster:clusters(id,name,description),article_categories:article_categories(categories(id,name))`,
      { count: "exact" },
    );

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }

  if (categories && categories.length > 0) {
    query = query.contains("category_ids", categories);
  }

  if (sources && sources.length > 0) {
    query = query.in("source", sources);
  }

  if (dateFrom) {
    query = query.gte("published_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("published_at", dateTo);
  }

  if (sort === "oldest") {
    query = query.order("published_at", { ascending: true, nullsFirst: false });
  } else if (sort === "popular") {
    query = query.order("insight_count", { ascending: false }).order("published_at", { ascending: false });
  } else {
    query = query.order("published_at", { ascending: false, nullsFirst: false });
  }

  return query;
};

const fetchSavedIds = async (userId?: string) => {
  if (!userId) return new Set<string>();
  const { data, error } = await supabase
    .from("saved_articles")
    .select("article_id")
    .eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((row) => String(row.article_id)));
};

const fetchInsightIds = async (userId?: string) => {
  if (!userId) return new Set<string>();
  const { data, error } = await supabase
    .from("article_insights")
    .select("article_id")
    .eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((row) => String(row.article_id)));
};

export const fetchArticles = async (
  filters: Partial<ArticleQuery> = {},
): Promise<PaginatedResult<Article>> => {
  const { page, pageSize, userId } = { ...defaultPagination, ...filters };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const savedIdsPromise = fetchSavedIds(userId);
  const insightIdsPromise = fetchInsightIds(userId);

  const { data, error, count } = await buildArticleQuery({
    ...defaultPagination,
    ...filters,
    page,
    pageSize,
  }).range(from, to);

  if (error) throw error;

  const [savedIds, insightIds] = await Promise.all([savedIdsPromise, insightIdsPromise]);

  const articles = (data ?? []).map((record) => mapArticle(record, savedIds, insightIds));

  return {
    data: articles,
    total: count ?? articles.length,
    page,
    pageSize,
  };
};

export const fetchLatestArticles = async (limit = 6, userId?: string) => {
  const { data, error } = await buildArticleQuery({ ...defaultPagination, page: 1, pageSize: limit })
    .limit(limit);
  if (error) throw error;
  const [savedIds, insightIds] = await Promise.all([fetchSavedIds(userId), fetchInsightIds(userId)]);
  return (data ?? []).map((record) => mapArticle(record, savedIds, insightIds));
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("categories").select("id,name,slug").order("name");
  if (error) throw error;
  return (data ?? []).map((category) => ({
    id: String(category.id),
    name: category.name,
    slug: category.slug ?? null,
  }));
};

export const fetchClusters = async (): Promise<Cluster[]> => {
  const { data, error } = await supabase.from("clusters").select("id,name,description").order("name");
  if (error) throw error;
  return (data ?? []).map((cluster) => ({
    id: String(cluster.id),
    name: cluster.name,
    description: cluster.description ?? null,
  }));
};

export const fetchSavedArticles = async (
  userId: string,
  page = 1,
  pageSize = 12,
): Promise<PaginatedResult<Article>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("saved_articles")
    .select("id,created_at,article:articles(id,title,summary,content,image_url,image_path,published_at,source,insight_count,cluster:clusters(id,name,description),article_categories:article_categories(categories(id,name)))", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  const articles = (data ?? [])
    .filter((row) => row.article)
    .map((row: any) => {
      const articleRecord = row.article;
      const savedSet = articleRecord?.id ? new Set([String(articleRecord.id)]) : new Set<string>();
      return mapArticle(articleRecord, savedSet);
    });
  return { data: articles, total: count ?? articles.length, page, pageSize };
};

export const saveArticle = async (articleId: string, userId: string) => {
  const { error } = await supabase.from("saved_articles").upsert({
    article_id: articleId,
    user_id: userId,
  }, { onConflict: "article_id,user_id" });
  if (error) throw error;
};

export const removeSavedArticle = async (articleId: string, userId: string) => {
  const { error } = await supabase
    .from("saved_articles")
    .delete()
    .eq("article_id", articleId)
    .eq("user_id", userId);
  if (error) throw error;
};

export const getSavedArticles = async (userId: string): Promise<Article[]> => {
  const { data } = await fetchSavedArticles(userId, 1, 200);
  return data;
};

export const addInsight = async (articleId: string, userId: string) => {
  const { error } = await supabase.from("article_insights").upsert({
    article_id: articleId,
    user_id: userId,
  }, { onConflict: "article_id,user_id" });
  if (error) throw error;
};

export const removeInsight = async (articleId: string, userId: string) => {
  const { error } = await supabase
    .from("article_insights")
    .delete()
    .eq("article_id", articleId)
    .eq("user_id", userId);
  if (error) throw error;
};

export const getInsightCount = async (articleId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("article_insights")
    .select("id", { head: true, count: "exact" })
    .eq("article_id", articleId);
  if (error) throw error;
  return count ?? 0;
};

export const getPublicImageUrl = (path: string) => {
  const { data } = supabase.storage.from("articles").getPublicUrl(path, {
    transform: { width: 1200 },
  });
  return data?.publicUrl ?? path;
};
