export type Category = {
  id: string;
  name: string;
  slug?: string | null;
};

export type Source = {
  id: string;
  name: string;
  slug?: string | null;
};

export type ArticleRecord = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  published_at?: string | null;
  source?: string | null;
  source_id?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type Article = {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  publishedAt?: string | null;
  sources?: string[];
  categories?: Category[];
  bookmarked?: boolean;
  insighted?: boolean;
  insightCount?: number;
};

export type ArticleFilters = {
  search?: string;
  categories?: string[];
  sources?: string[];
  dateFrom?: string;
  dateTo?: string;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type SavedArticle = {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
  article?: Article;
};

export type UserPreference = {
  userId: string;
  categoryIds: string[];
  sourceIds: string[];
  jobTitle?: string | null;
};
