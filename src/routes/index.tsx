import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  Crown,
  Flame,
  Gift,
  HelpCircle,
  Lock,
  Medal,
  PenLine,
  Rocket,
  Scale,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import { AppShell } from "@/components/namma/app-shell";
import {
  ACTIVITIES,
  ACTIVITY_ORDER,
  HUB_ICONS,
} from "@/components/namma/activity/lesson-data";
import { getCompleted } from "@/components/namma/activity/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Namma AI" },
      {
        name: "description",
        content:
          "Premium AI learning dashboard for Grades 5–10. Weekly roadmap, XP, streaks, badges, leaderboards and character-led missions with Neo, Dev & Anaya.",
      },
    ],
  }),
  component: DashboardPage,
});

/* ───────────────────────── data ───────────────────────── */

type FlowNode = {
  key: string;
  label: string;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
  done: boolean;
  current?: boolean;
  locked?: boolean;
};

// Weekly Adventure Flow — the 7-step sequence that repeats every week.
const WEEKLY_FLOW: FlowNode[] = [
  { key: "story", label: "Story & Concept", tone: "story", icon: BookOpen, done: true },
  { key: "explore", label: "Explore & Observe", tone: "explore", icon: Compass, done: true },
  { key: "decide", label: "Do & Decide", tone: "decide", icon: Target, done: true },
  { key: "write", label: "Think & Write", tone: "reflect", icon: PenLine, done: false, current: true },
  { key: "ethics", label: "Ethics Scenario", tone: "challenge", icon: Scale, done: false },
  { key: "quiz", label: "Weekly Quiz", tone: "xp", icon: Brain, done: false },
  { key: "reward", label: "Reward Unlock", tone: "bonus", icon: Gift, done: false, locked: true },
];

const ACHIEVEMENTS = [
  { name: "First Mission", tone: "story", icon: Rocket, earned: true, sub: "Sealed Week 1" },
  { name: "3-Week Streak", tone: "decide", icon: Flame, earned: true, sub: "Three weeks strong" },
  { name: "AI Spotter", tone: "explore", icon: Compass, earned: true, sub: "10 examples found" },
  { name: "Ethics Hero", tone: "challenge", icon: Medal, earned: false, sub: "Finish ethics" },
  { name: "Weekly Champion", tone: "xp", icon: Crown, earned: false, sub: "Complete this week" },
  { name: "Reward Hunter", tone: "bonus", icon: Gift, earned: false, sub: "Open 5 rewards" },
] as const;

const LEADERBOARD = [
  { rank: 1, name: "Meera P.", xp: 1840, you: false },
  { rank: 2, name: "Aarav (You)", xp: 1620, you: true },
  { rank: 3, name: "Kabir S.", xp: 1495, you: false },
  { rank: 4, name: "Diya R.", xp: 1380, you: false },
  { rank: 5, name: "Ishaan V.", xp: 1240, you: false },
] as const;

const REWARDS = [
  { title: "Weekly Completion XP", sub: "+50 XP when this week's done", icon: Star, tone: "xp", cta: "View" },
  { title: "Weekly Champion Chest", sub: "Unlocks after 5 completed weeks", icon: Gift, tone: "bonus", cta: "Open" },
  { title: "Mystery sticker", sub: "Earn 3 more badges", icon: Sparkles, tone: "reflect", cta: "Preview" },
] as const;

/* ───────────────────────── page ───────────────────────── */

function DashboardPage() {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    const load = () => setCompleted(new Set(getCompleted()));
    load();
    window.addEventListener("namma:progress", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("namma:progress", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const totalXp = ACTIVITY_ORDER.reduce((s, k) => s + ACTIVITIES[k].meta.totalXp, 0);
  const earnedXp = ACTIVITY_ORDER.filter((s) => completed.has(s)).reduce(
    (s, k) => s + ACTIVITIES[k].meta.totalXp,
    0,
  );
  const baseXp = 1620;
  const liveXp = baseXp + earnedXp;
  const xpToNext = 2000;
  const xpPercent = Math.min(100, Math.round((liveXp / xpToNext) * 100));
  const weekPercent = Math.round((completed.size / ACTIVITY_ORDER.length) * 100);
  const nextSlug = ACTIVITY_ORDER.find((s) => !completed.has(s)) ?? ACTIVITY_ORDER[0];
  const next = ACTIVITIES[nextSlug];
  const NextIcon = HUB_ICONS[nextSlug];
  const earnedBadges = ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* ───── HERO ───── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-explore-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-story/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-bonus/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.45fr_1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-story/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-story">
                <Sparkles className="h-3 w-3" /> Welcome back, Aarav
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                Your next{" "}
                <span className="bg-gradient-to-r from-story via-reflect to-decide bg-clip-text text-transparent">
                  AI adventure
                </span>{" "}
                is one tap away.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Continue Week 9 with Dev, Neo & Anaya. Earn XP, grow your weekly streak,
                and unlock the legendary Weekly Champion badge.
              </p>

              {/* XP rail */}
              <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2 text-xp">
                    <Star className="h-3.5 w-3.5" /> Level 7 · Explorer
                  </span>
                  <span className="text-foreground">
                    {liveXp} / {xpToNext} XP
                  </span>
                </div>
                <div className="progress-shell mt-3 !h-3">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[0.72rem] text-muted-foreground">
                  <span>{xpToNext - liveXp} XP to Level 8</span>
                  <span className="font-bold text-foreground">{xpPercent}%</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/activities/$slug" params={{ slug: nextSlug }}>
                    <NextIcon className="h-5 w-5" />
                    Continue · {next.meta.title}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="xp" size="lg">
                  <Gift className="h-4 w-4" /> Claim +50 XP
                </Button>
              </div>
            </div>

            {/* Character moment */}
            <div className="relative hidden h-72 items-end justify-center md:flex">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm" />
              <motion.img
                src={devHappy}
                alt="Dev"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute bottom-2 left-2 h-36 w-36 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]"
              />
              <motion.img
                src={neoCelebrating}
                alt="Neo"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-52 w-52 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
              />
              <motion.img
                src={anayaHappy}
                alt="Anaya"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-2 right-2 h-36 w-36 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]"
              />
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-2xl border border-white bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-[var(--shadow-soft)]"
              >
                <span className="text-story">Neo:</span> Let&apos;s GO! 🚀
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ───── STAT STRIP ───── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <StatTile icon={<Star className="h-5 w-5" />} tone="xp" label="Total XP" value={String(liveXp)} sub={`+${earnedXp || 50} today`} />
          <StatTile icon={<Flame className="h-5 w-5" />} tone="decide" label="Weekly streak" value="5 weeks" sub="Champion run!" />
          <StatTile icon={<Trophy className="h-5 w-5" />} tone="bonus" label="Badges" value={`${earnedBadges}/${ACHIEVEMENTS.length}`} sub="2 new this week" />
          <StatTile icon={<Target className="h-5 w-5" />} tone="challenge" label="Rank" value="#2" sub="↑ 1 this week" />
        </motion.section>

        {/* ───── WEEKLY ADVENTURE FLOW ───── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="section-panel relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-story/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-xp/15 blur-3xl" />

          <div className="relative flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="eyebrow">
                <Compass className="h-3.5 w-3.5" /> Weekly Adventure Flow
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                This week&apos;s magical journey
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete all activities before next week unlocks to grow your weekly streak.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft/70 px-3 py-1.5 font-display text-sm font-bold text-success">
              <CheckCircle2 className="h-4 w-4" /> {weekPercent}% week complete
            </div>
          </div>

          <div className="relative mt-8">
            {/* connecting rail */}
            <div className="absolute top-9 right-6 left-6 h-1.5 rounded-full bg-secondary/70" />
            <motion.div
              className="absolute top-9 left-6 h-1.5 rounded-full bg-gradient-to-r from-story via-explore via-decide via-reflect via-challenge via-xp to-bonus shadow-[0_0_18px_rgba(120,80,200,0.35)]"
              initial={{ width: 0 }}
              whileInView={{ width: `calc(${weekPercent}% - 3rem)` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <div className="relative grid grid-cols-4 gap-3 md:grid-cols-7">
              {WEEKLY_FLOW.map((n, i) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 22 }}
                    whileHover={!n.locked ? { y: -4, scale: 1.04 } : undefined}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="relative">
                      {n.current && (
                        <span className={cn("absolute inset-0 rounded-2xl blur-md opacity-70", `bg-${n.tone}/60`)} />
                      )}
                      <div
                        className={cn(
                          "relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-2 shadow-[var(--shadow-soft)] transition-all",
                          n.done && `bg-gradient-to-br from-${n.tone} to-${n.tone}/70 text-white border-white/80 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.25)]`,
                          !n.done && n.current && `bg-white text-${n.tone} border-${n.tone} animate-[namma-pulse_2.4s_ease-in-out_infinite]`,
                          !n.done && !n.current && !n.locked && `bg-white text-${n.tone}/80 border-${n.tone}/30`,
                          n.locked && "bg-muted text-locked border-locked/30",
                        )}
                      >
                        {n.done ? (
                          <CheckCircle2 className="h-7 w-7" />
                        ) : n.locked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <Icon className="h-7 w-7" />
                        )}
                      </div>
                      {n.current && (
                        <span className="absolute -top-1.5 -right-1.5 inline-flex items-center gap-1 rounded-full bg-foreground px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-background shadow">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-center leading-tight">
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Step {i + 1}
                      </div>
                      <div className={cn("text-[0.72rem] font-bold", n.current ? `text-${n.tone}` : n.locked ? "text-muted-foreground" : "text-foreground")}>
                        {n.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-reflect/20 bg-reflect-soft/40 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                <Sparkles className="h-4 w-4 text-reflect" />
                Finish this week&apos;s adventure to protect your streak and unlock rewards.
              </div>
              <div className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-reflect">
                <HelpCircle className="h-3.5 w-3.5" /> 7-step weekly sequence
              </div>
            </div>
          </div>
        </motion.section>

        {/* ───── CONTINUE JOURNEY + REWARDS ───── */}
        <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* Continue journey card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative overflow-hidden rounded-[28px] border bg-white/85 p-6 shadow-[var(--shadow-card)] backdrop-blur",
              `border-${next.meta.tone}/30`,
            )}
          >
            <div className={cn("pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-50 blur-3xl", `bg-${next.meta.tone}/40`)} />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
              <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] text-white shadow-[var(--shadow-float)]", `bg-gradient-to-br from-${next.meta.tone} to-${next.meta.tone}/70`)}>
                <NextIcon className="h-9 w-9" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  Continue journey · Activity {next.meta.activityNumber} of {ACTIVITY_ORDER.length}
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold text-foreground">
                  {next.emoji} {next.meta.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{next.blurb}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-bold", `bg-${next.meta.tone}-soft text-${next.meta.tone}`)}>
                    <Star className="h-3 w-3" /> +{next.meta.totalXp} XP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-bold text-muted-foreground">
                    <Trophy className="h-3 w-3" /> {next.meta.badge}
                  </span>
                </div>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/activities/$slug" params={{ slug: nextSlug }}>
                  Resume <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* mini path */}
            <div className="relative mt-6 flex items-center gap-1.5">
              {ACTIVITY_ORDER.map((slug) => {
                const done = completed.has(slug);
                const isNext = slug === nextSlug && !done;
                const tone = ACTIVITIES[slug].meta.tone;
                return (
                  <div
                    key={slug}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-all",
                      done && `bg-${tone}`,
                      !done && isNext && `bg-${tone}/40 animate-pulse`,
                      !done && !isNext && "bg-secondary",
                    )}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Rewards stack */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-panel !p-5"
          >
            <div className="flex items-center justify-between">
              <div className="eyebrow">
                <Gift className="h-3.5 w-3.5" /> Rewards
              </div>
              <Link to="/rewards" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Vault <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {REWARDS.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                  className={cn("flex items-center gap-3 rounded-[20px] border bg-white/80 p-3", `border-${r.tone}/25`)}
                >
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", `bg-${r.tone}-soft text-${r.tone}`)}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-bold text-foreground">{r.title}</div>
                    <div className="truncate text-[0.72rem] text-muted-foreground">{r.sub}</div>
                  </div>
                  <Button variant="xp" size="sm">
                    {r.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ───── ACHIEVEMENT CARDS ───── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow">
                <Award className="h-3.5 w-3.5" /> Achievements
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                Trophies in your case
              </h2>
            </div>
            <Link to="/badges" className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline md:inline-flex">
              All badges <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 220, damping: 20 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "relative overflow-hidden rounded-[24px] border p-4 text-center shadow-[var(--shadow-soft)] backdrop-blur transition-all",
                  a.earned ? `bg-${a.tone}-soft/60 border-${a.tone}/30` : "bg-white/70 border-border opacity-80",
                )}
              >
                {a.earned && (
                  <div className={cn("pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl", `bg-${a.tone}/40`)} />
                )}
                <div
                  className={cn(
                    "relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-[var(--shadow-soft)]",
                    a.earned ? `bg-gradient-to-br from-${a.tone} to-${a.tone}/70 text-white` : "bg-muted text-locked",
                  )}
                >
                  {a.earned ? <a.icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="relative mt-3 font-display text-sm font-bold text-foreground">{a.name}</div>
                <div className="relative text-[0.68rem] text-muted-foreground">{a.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ───── LEADERBOARD + CHARACTER MOMENT ───── */}
        <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-panel"
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="eyebrow">
                  <Crown className="h-3.5 w-3.5" /> Leaderboard
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                  Class Explorers · Week 9
                </h2>
              </div>
              <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">
                Full board →
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {LEADERBOARD.map((p, i) => (
                <motion.li
                  key={p.rank}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 transition-all",
                    p.you
                      ? "border-primary/40 bg-primary/8 shadow-[var(--shadow-soft)]"
                      : "border-border/60 bg-white/70 hover:bg-white",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl font-display text-sm font-bold",
                      p.rank === 1 && "bg-xp text-white",
                      p.rank === 2 && "bg-explore text-white",
                      p.rank === 3 && "bg-decide text-white",
                      p.rank > 3 && "bg-muted text-muted-foreground",
                    )}
                  >
                    {p.rank === 1 ? <Crown className="h-5 w-5" /> : `#${p.rank}`}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-bold text-foreground">{p.name}</div>
                    <div className="text-[0.7rem] text-muted-foreground">Level {Math.max(1, Math.round(p.xp / 250))} · Explorer</div>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-xp-soft px-2.5 py-1 font-display text-xs font-bold text-xp">
                    <Star className="h-3 w-3" /> {p.xp}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Motivational character moment */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-reflect-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-float)]"
          >
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-reflect/25 blur-3xl" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-reflect/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-reflect">
                <Sparkles className="h-3 w-3" /> Anaya says
              </div>
              <p className="font-display text-xl font-bold leading-tight text-foreground md:text-2xl">
                &ldquo;You&apos;re only <span className="text-reflect">2 activities</span> away from
                unlocking the Weekly Champion crown — I believe in you!&rdquo;
              </p>
              <div className="flex items-end gap-3">
                <motion.img
                  src={anayaCelebrating}
                  alt="Anaya celebrating"
                  className="h-32 w-32 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_18px_28px_rgba(0,0,0,0.16)]"
                />
                <motion.img
                  src={neoExplaining}
                  alt="Neo"
                  className="h-24 w-24 object-contain animate-[namma-float_5.4s_ease-in-out_infinite] drop-shadow-[0_18px_28px_rgba(0,0,0,0.16)]"
                />
                <motion.img
                  src={devExplaining}
                  alt="Dev"
                  className="h-24 w-24 object-contain animate-[namma-float_4.8s_ease-in-out_infinite] drop-shadow-[0_18px_28px_rgba(0,0,0,0.16)]"
                />
              </div>
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/activities">
                  <Zap className="h-4 w-4" />
                  Open the journey map
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* ───── PROGRESS WIDGETS ───── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <ProgressWidget
            tone="story"
            icon={<Compass className="h-5 w-5" />}
            label="Week 9 progress"
            percent={weekPercent}
            caption={`${completed.size}/${ACTIVITY_ORDER.length} activities`}
          />
          <ProgressWidget
            tone="xp"
            icon={<Star className="h-5 w-5" />}
            label="XP to Level 8"
            percent={xpPercent}
            caption={`${liveXp} / ${xpToNext} XP`}
          />
          <ProgressWidget
            tone="decide"
            icon={<Flame className="h-5 w-5" />}
            label="Weekly completion goal"
            percent={weekPercent}
            caption={`${completed.size} / ${ACTIVITY_ORDER.length} activities this week`}
          />
        </motion.section>
      </div>
    </AppShell>
  );
}

/* ───────────────────────── widgets ───────────────────────── */

function StatTile({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "xp" | "decide" | "bonus" | "challenge";
}) {
  const toneClass: Record<typeof tone, string> = {
    xp: "bg-xp-soft text-xp",
    decide: "bg-decide-soft text-decide",
    bonus: "bg-bonus-soft text-bonus",
    challenge: "bg-challenge-soft text-challenge",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="stat-pill !p-4"
    >
      <span className={`stat-pill-icon ${toneClass[tone]}`}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <div className="font-display text-xl font-bold text-foreground">{value}</div>
        <div className="text-[0.7rem] text-muted-foreground">{sub}</div>
      </div>
    </motion.div>
  );
}

function ProgressWidget({
  tone,
  icon,
  label,
  percent,
  caption,
}: {
  tone: "story" | "xp" | "decide";
  icon: React.ReactNode;
  label: string;
  percent: number;
  caption: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={cn("rounded-[24px] border bg-white/80 p-5 shadow-[var(--shadow-soft)] backdrop-blur", `border-${tone}/25`)}
    >
      <div className="flex items-center gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${tone}-soft text-${tone}`)}>
          {icon}
        </span>
        <div className="leading-tight">
          <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
          <div className="font-display text-lg font-bold text-foreground">{percent}%</div>
        </div>
      </div>
      <div className="progress-shell mt-4 !h-2.5">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-[0.72rem] text-muted-foreground">{caption}</div>
    </motion.div>
  );
}
