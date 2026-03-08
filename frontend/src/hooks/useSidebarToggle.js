import { useEffect, useState } from "react";

const SIDEBAR_STATE_KEY = "network-activity-sidebar-open";

export function useSidebarToggle(defaultOpen = true) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return defaultOpen;
    }

    const savedState = window.localStorage.getItem(SIDEBAR_STATE_KEY);

    if (savedState === null) {
      return defaultOpen;
    }

    return savedState === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((previousState) => !previousState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };
}