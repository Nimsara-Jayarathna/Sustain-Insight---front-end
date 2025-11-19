import { create } from "zustand";
import { fetchAppSettings, saveAppSettings } from "../services/supabaseAdmin";

const DEFAULT_SETTINGS = {
  landingArticleCount: 8,
  feedPageSize: 12,
  feedRecentHours: 24,
};

type SettingsState = {
  id: string | null;
  landingArticleCount: number;
  feedPageSize: number;
  feedRecentHours: number;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  saveSettings: (values: { landingArticleCount: number; feedPageSize: number; feedRecentHours: number; updatedBy?: string | null }) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  id: null,
  ...DEFAULT_SETTINGS,
  loading: false,
  error: null,
  initialized: false,
  initialize: async () => {
    if (get().initialized || get().loading) return;
    set({ loading: true });
    try {
      const settings = await fetchAppSettings();
      set({
        id: settings.id,
        landingArticleCount: settings.landing_article_count ?? DEFAULT_SETTINGS.landingArticleCount,
        feedPageSize: settings.feed_page_size ?? DEFAULT_SETTINGS.feedPageSize,
        feedRecentHours: settings.feed_recent_hours ?? DEFAULT_SETTINGS.feedRecentHours,
        loading: false,
        initialized: true,
        error: null,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.message ?? "Unable to load settings",
        initialized: true,
      });
    }
  },
  saveSettings: async ({ landingArticleCount, feedPageSize, feedRecentHours, updatedBy }) => {
    set({ loading: true, error: null });
    try {
      const currentId = get().id;
      const updated = await saveAppSettings({
        id: currentId,
        landing_article_count: landingArticleCount,
        feed_page_size: feedPageSize,
        feed_recent_hours: feedRecentHours,
        updatedBy,
      });
      set({
        id: updated.id,
        landingArticleCount: updated.landing_article_count ?? landingArticleCount,
        feedPageSize: updated.feed_page_size ?? feedPageSize,
        feedRecentHours: updated.feed_recent_hours ?? feedRecentHours,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.message ?? "Unable to save settings",
      });
      throw err;
    }
  },
}));
