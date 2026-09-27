export type Article = {
  id: number | string;
  title: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  publishedAt?: string;
  sources?: string[];
  categories?: string[];
  bookmarked?: boolean;
  insighted?: boolean;
  insightCount?: number;
  category?: string;
  excerpt?: string;
  slug?: string;
  url?: string;
  link?: string;
};

export type NamedOption = {
  id: number;
  name: string;
};

export type ArticleFilters = {
  keyword?: string;
  categoryIds?: number[];
  sourceIds?: number[];
  categoryNames?: string[];
  sourceNames?: string[];
  date?: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  preferredCategories?: NamedOption[];
  preferredSources?: NamedOption[];
};

export type PaginatedArticles = {
  content: Article[];
  totalPages: number;
  currentPage?: number;
};
