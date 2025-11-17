import { create } from "zustand";
import type { ArticleFilters } from "../types/content";

type FilterState = ArticleFilters & {
  page: number;
  pageSize: number;
};

type FilterStore = FilterState & {
  setSearch: (value: string) => void;
  setCategories: (ids: string[]) => void;
  setSources: (ids: string[]) => void;
  setDateRange: (from?: string, to?: string) => void;
  setSort: (sort: FilterState["sort"]) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
};

const initialState: FilterState = {
  search: "",
  categories: [],
  sources: [],
  dateFrom: undefined,
  dateTo: undefined,
  sort: "newest",
  page: 1,
  pageSize: 12,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setSearch: (value) => set({ search: value, page: 1 }),
  setCategories: (ids) => set({ categories: ids, page: 1 }),
  setSources: (ids) => set({ sources: ids, page: 1 }),
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to, page: 1 }),
  setSort: (sort) => set({ sort: sort ?? "newest", page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (size) => set({ pageSize: size, page: 1 }),
  reset: () => set(initialState),
}));
