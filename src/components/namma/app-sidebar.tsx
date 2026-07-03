import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Compass,
  Flame,
  LayoutDashboard,
  Shield,
  Zap,
} from "lucide-react";

import neoHappy from "@/assets/characters/neo-happy.png";
import { BrandMark } from "@/components/namma/brand-mark";
import { cn } from "@/lib/utils";
import { useAppShell } from "@/components/namma/app-shell-context";
import {
  ACTIVITY_ORDER,
} from "@/components/namma/activity/lesson-data";
import { getCompleted } from "@/components/namma/activity/progress";
import {
  getAuth,
  getCompletedWeeks,
  getProfile,
  onNammaState,
  type NammaProfile,
  type UserRole,
} from "@/lib/namma-progress";
import { navForRole, type RoleNavItem } from "@/lib/namma-roles";




type NavItem = RoleNavItem;


const toneText: Record<NavItem["tone"], string> = {
  story: "text-story",
  explore: "text-explore",
  decide: "text-decide",
  reflect: "text-reflect",
  challenge: "text-challenge",
  bonus: "text-bonus",
  xp: "text-xp",
  success: "text-success",
};
const toneBg: Record<NavItem["tone"], string> = {
  story: "bg-story-soft",
  explore: "bg-explore-soft",
  decide: "bg-decide-soft",
  reflect: "bg-reflect-soft",
  challenge: "bg-challenge-soft",
  bonus: "bg-bonus-soft",
  xp: "bg-xp-soft",
  success: "bg-success-soft",
};

export function AppSidebar() {
  const { collapsed, toggleCollapsed, isMobile, setMobileOpen } = useAppShell();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isCollapsed = !isMobile && collapsed;

  const [role, setRole] = React.useState<UserRole | null>(() => getAuth().role);
  React.useEffect(() => {
    const sync = () => setRole(getAuth().role);
    sync();
    return onNammaState(sync);
  }, []);
  const NAV: NavItem[] = React.useMemo(() => navForRole(role), [role]);
  const isStudent = role === "student" || role === null;


  return (
    <aside
      className={cn(
        "namma-sidebar relative flex h-full flex-col gap-5 p-4",
        isCollapsed ? "w-[88px]" : "w-[280px]",
      )}
    >
      {/* Brand */}
      <div className="flex items-center justify-between gap-3 px-1">
        <Link
          to="/"
          onClick={() => isMobile && setMobileOpen(false)}
          className="flex items-center gap-3 group"
        >
          <BrandMark size={40} />
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-extrabold text-foreground tracking-tight">
                Namma AI
              </span>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Learn · Play · Create
              </span>
            </div>
          )}
        </Link>
        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="namma-icon-btn"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")}
            />
          </button>
        )}
      </div>

      {/* Profile widget (student only; principal/teacher/admin get a compact identity strip) */}
      {isStudent ? (
        <ProfileWidget collapsed={isCollapsed} />
      ) : (
        <RoleIdentity role={role} collapsed={isCollapsed} />
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-0.5">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.to === "/" ? currentPath === "/" :
              currentPath === item.to || currentPath.startsWith(item.to + "/");
            return (
              <li key={item.to}>
                <Link
                  to={item.to as string}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={cn("namma-nav-item group", active && "namma-nav-item-active")}
                  data-active={active}
                >
                  <span
                    className={cn(
                      "namma-nav-icon",
                      active ? cn(toneBg[item.tone], toneText[item.tone]) : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate text-sm font-semibold">{item.label}</span>
                      {item.badge && (
                        <span className="namma-nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active-glow"
                      className="namma-nav-active-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Neo helper — student only. Principal/teacher/admin keep the ERP feel. */}
      {isStudent && (
        <>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="helper"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="namma-helper-card"
              >
                <img
                  src={neoHappy}
                  alt="Neo"
                  className="h-16 w-16 shrink-0 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
                />
                <div className="min-w-0">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-explore">
                    Neo says
                  </div>
                  <p className="mt-1 text-xs leading-5 text-foreground/85">
                    You&apos;re 2 missions away from your next badge!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && <CollapsedStreak />}
        </>
      )}

    </aside>
  );
}

function RoleIdentity({ role, collapsed }: { role: UserRole | null; collapsed: boolean }) {
  const auth = getAuth();
  const label =
    role === "principal" ? "Principal" :
    role === "teacher" ? "Teacher" :
    role === "admin" ? "Namma AI Admin" : "Guest";
  const initial = (auth.email ?? label).charAt(0).toUpperCase();
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="namma-avatar">{initial}</div>
      </div>
    );
  }
  return (
    <div className="namma-profile-card">
      <div className="flex items-center gap-3">
        <div className="namma-avatar">{initial}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[0.95rem] font-bold text-foreground">
            {auth.email ?? label}
          </div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}{auth.schoolCode ? ` · ${auth.schoolCode}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}


function useNammaSnapshot() {
  const [profile, setProfile] = React.useState<NammaProfile>(() => getProfile());
  const [weeksDone, setWeeksDone] = React.useState(0);
  const [activitiesDone, setActivitiesDone] = React.useState(0);

  React.useEffect(() => {
    const load = () => {
      setProfile(getProfile());
      setWeeksDone(getCompletedWeeks().length);
      setActivitiesDone(getCompleted().length);
    };
    load();
    const off = onNammaState(load);
    window.addEventListener("namma:progress", load);
    window.addEventListener("storage", load);
    return () => {
      off();
      window.removeEventListener("namma:progress", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const currentWeek = Math.max(1, weeksDone + 1);
  const weekPercent = Math.round((activitiesDone / ACTIVITY_ORDER.length) * 100);
  return { profile, weeksDone, activitiesDone, currentWeek, weekPercent };
}

function CollapsedStreak() {
  const { weeksDone } = useNammaSnapshot();
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="namma-streak-mini" aria-label={`${weeksDone} week streak`}>
        <Flame className="h-4 w-4" />
        <span>{weeksDone}w</span>
      </div>
    </div>
  );
}

function ProfileWidget({ collapsed }: { collapsed: boolean }) {
  const { profile, weeksDone, currentWeek, weekPercent } = useNammaSnapshot();
  const initial = (profile.name || "Explorer").trim().charAt(0).toUpperCase() || "E";
  const level = 1; // Phase 1: every learner is Level 1

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="namma-avatar">{initial}</div>
        <div className="namma-level-pill-mini" title={`Level ${level}`}>
          <Shield className="h-3.5 w-3.5" />
          <span>{level}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="namma-profile-card">
      <div className="flex items-center gap-3">
        <div className="namma-avatar">{initial}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-[0.95rem] font-bold text-foreground">
              {profile.name || "Explorer"}
            </span>
            <span className="namma-level-pill">
              <Shield className="h-3 w-3" />
              Lv {level}
            </span>
          </div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Explorer · {profile.gradeLabel}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-story">
            <Compass className="h-3.5 w-3.5" /> Week {currentWeek}
          </span>
          <span>{weekPercent}% done</span>
        </div>
        <div className="namma-xp-rail mt-1.5">
          <div className="namma-xp-fill" style={{ width: `${weekPercent}%` }} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="namma-mini-stat">
          <span className="namma-mini-stat-icon bg-decide-soft text-decide">
            <Flame className="h-3.5 w-3.5" />
          </span>
          <div className="leading-tight">
            <div className="text-[0.95rem] font-bold text-foreground">{weeksDone}w</div>
            <div className="text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
              Weekly streak
            </div>
          </div>
        </div>
        <div className="namma-mini-stat">
          <span className="namma-mini-stat-icon bg-bonus-soft text-bonus">
            <Zap className="h-3.5 w-3.5" />
          </span>
          <div className="leading-tight">
            <div className="text-[0.95rem] font-bold text-foreground">{weeksDone}/35</div>
            <div className="text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
              Badges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



