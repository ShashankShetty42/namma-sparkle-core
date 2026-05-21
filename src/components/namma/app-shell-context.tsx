import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";

type AppShellContextValue = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  isMobile: boolean;
};

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("namma:sidebar-collapsed") === "1";
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("namma:sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const value = React.useMemo<AppShellContextValue>(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed: () => setCollapsed((c) => !c),
      mobileOpen,
      setMobileOpen,
      isMobile,
    }),
    [collapsed, mobileOpen, isMobile],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const ctx = React.useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used inside <AppShellProvider>");
  return ctx;
}
