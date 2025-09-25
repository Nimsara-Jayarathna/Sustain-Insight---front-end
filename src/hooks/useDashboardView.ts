import { useState } from "react";

export type DashboardView = "for-you" | "all-news" | "bookmarks";

export function useDashboardView(initial: DashboardView = "for-you") {
  const [activeView, setActiveView] = useState<DashboardView>(initial);
  return { activeView, setActiveView };
}
