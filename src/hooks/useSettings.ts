import { useSettingsStore } from "../stores/settingsStore";

export const useSettings = () => {
  const {
    landingArticleCount,
    feedPageSize,
    feedRecentHours,
    loading,
    error,
    initialize,
    saveSettings,
  } = useSettingsStore();

  return {
    landingArticleCount,
    feedPageSize,
    feedRecentHours,
    loading,
    error,
    initialize,
    saveSettings,
  };
};
