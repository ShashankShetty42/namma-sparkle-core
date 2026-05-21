import * as React from "react";
import { motion } from "framer-motion";
import { Bell, Flame, Menu, Search, Sparkles, Star } from "lucide-react";

import { useAppShell } from "@/components/namma/app-shell-context";

export function TopBar() {
  const { isMobile, setMobileOpen } = useAppShell();

  return (
    <header className="namma-topbar">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="namma-icon-btn"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <div className="namma-eyebrow-pill">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Today&apos;s adventure</span>
        </div>
        <h1 className="hidden font-display text-base font-bold text-foreground md:block">
          Welcome back, Aarav
        </h1>
      </div>

      <div className="hidden flex-1 max-w-md md:flex">
        <label className="namma-search">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search missions, badges, lessons..."
            className="bg-transparent outline-none placeholder:text-muted-foreground/70 w-full text-sm"
          />
          <kbd className="namma-kbd">⌘K</kbd>
        </label>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <AnimatedCounter
          value={320}
          icon={<Star className="h-4 w-4" />}
          suffix="XP"
          toneClass="text-xp bg-xp-soft"
        />
        <StreakFlame count={5} />
        <button type="button" aria-label="Notifications" className="namma-icon-btn relative">
          <Bell className="h-4 w-4" />
          <span className="namma-dot" />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="namma-avatar-sm shrink-0"
          title="Aarav K."
        >
          A
        </button>
      </div>
    </header>
  );
}

function AnimatedCounter({
  value,
  suffix,
  icon,
  toneClass,
}: {
  value: number;
  suffix: string;
  icon: React.ReactNode;
  toneClass: string;
}) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="namma-stat-chip">
      <span className={`namma-stat-chip-icon ${toneClass}`}>{icon}</span>
      <span className="hidden sm:flex items-baseline gap-1">
        <span className="font-reward text-base leading-none text-foreground">{display}</span>
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {suffix}
        </span>
      </span>
    </div>
  );
}

function StreakFlame({ count }: { count: number }) {
  return (
    <motion.div
      className="namma-stat-chip"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
    >
      <span className="namma-stat-chip-icon text-decide bg-decide-soft">
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame className="h-4 w-4" />
        </motion.span>
      </span>
      <span className="hidden sm:flex items-baseline gap-1">
        <span className="font-reward text-base leading-none text-foreground">{count}</span>
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          day
        </span>
      </span>
    </motion.div>
  );
}
