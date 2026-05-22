import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { AppShellProvider, useAppShell } from "@/components/namma/app-shell-context";
import { AppSidebar } from "@/components/namma/app-sidebar";
import { TopBar } from "@/components/namma/top-bar";
import { OnboardingDialog } from "@/components/namma/onboarding-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getProfile, onNammaState } from "@/lib/namma-progress";

const WELCOME_KEY = "namma:welcome:lastSession";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShellProvider>
      <ShellInner>{children}</ShellInner>
    </AppShellProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isMobile, mobileOpen, setMobileOpen } = useAppShell();

  // Per-session welcome moment (after onboarding is done).
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const fire = () => {
      const profile = getProfile();
      if (!profile.onboarded) return;
      const last = window.sessionStorage.getItem(WELCOME_KEY);
      if (last) return;
      window.sessionStorage.setItem(WELCOME_KEY, String(Date.now()));
      const buddy = profile.favorite === "neo" ? "Neo" : profile.favorite === "dev" ? "Dev" : "Anaya";
      const wave = profile.favorite === "neo" ? "👋" : profile.favorite === "dev" ? "🤖" : "💫";
      window.setTimeout(() => {
        toast(`${buddy} says hi ${wave}`, {
          description: `Welcome back, ${profile.name}. Ready for today's adventure?`,
          duration: 4500,
        });
      }, 900);
    };
    fire();
    const off = onNammaState(fire);
    return () => off();
  }, []);

  return (
    <div className="namma-shell">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="namma-sidebar-rail">
          <AppSidebar />
        </div>
      )}

      {/* Mobile sidebar drawer */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[300px] border-none p-0 bg-transparent shadow-none">
            <div className="h-full p-2">
              <AppSidebar />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="namma-main">
        <TopBar />
        <AnimatePresence mode="wait">
          <motion.main
            key={typeof window !== "undefined" ? window.location.pathname : "page"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
            className="namma-page"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <OnboardingDialog />
    </div>
  );
}
