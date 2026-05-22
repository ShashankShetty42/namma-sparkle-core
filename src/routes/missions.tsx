import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flame,
  Lock,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/namma/app-shell";
import { ACTIVITIES, ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import { getCompleted } from "@/components/namma/activity/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  getProfile,
  getWeeklyStreak,
  getTotalXP,
  onNammaState,
} from "@/lib/namma-progress";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions · Namma AI" },
      {
        name: "description",
        content:
          "Your active weekly missions on Namma AI — finish six magical activities and unlock new creative challenges.",
      },
    ],
  }),
  component: MissionsPage,
});

type MissionTone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";

type CompanionMission = {
  id: string;
  title: string;
  description: string;
  character: "neo" | "dev" | "anaya";
  tone: MissionTone;
  reward: string;
  cta: string;
};

const COMPANION_MISSIONS: CompanionMission[] = [
  {
    id: "neo-spark",
    title: "Spot an AI in your home",
    description:
      "Look around — a smart speaker, a recommendation feed, an autocorrect. Tell Neo what you found.",
    character: "neo",
    tone: "story",
    reward: "+30 XP · Curiosity Spark",
    cta: "Share with Neo",
  },
  {
    id: "dev-logic",
    title: "Beat Dev at Pattern Match",
    description:
      "A tiny logic warm-up: guess the next item in three patterns. Dev is keeping score.",
    character: "dev",
    tone: "decide",
    reward: "+40 XP · Logic Streak",
    cta: "Take the warm-up",
  },
  {
    id: "anaya-kind",
    title: "Anaya's kindness prompt",
    description:
      "If an AI could help one person in your school today, who would it be — and how? Tell Anaya in one line.",
    character: "anaya",
    tone: "reflect",
    reward: "+30 XP · Kind Coder",
    cta: "Send to Anaya",
  },
];

const CHARACTER_IMG: Record<CompanionMission["character"], string> = {
  neo: neoCelebrating,
  dev: devThinking,
  anaya: anayaHappy,
};

function MissionsPage() {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [streak, setStreak] = React.useState(0);
  const [xp, setXp] = React.useState(0);
  const [profileName, setProfileName] = React.useState("Explorer");
  const [doneCompanion, setDoneCompanion] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const load = () => {
      setCompleted(new Set(getCompleted()));
      setStreak(getWeeklyStreak());
      setXp(getTotalXP());
      setProfileName(getProfile().name);
    };
    load();
    const off = onNammaState(load);
    window.addEventListener("namma:progress", load);
    return () => {
      off();
      window.removeEventListener("namma:progress", load);
    };
  }, []);

  const coreDone = ACTIVITY_ORDER.filter((s) => completed.has(s)).length;
  const corePct = Math.round((coreDone / ACTIVITY_ORDER.length) * 100);
  const weekComplete = coreDone === ACTIVITY_ORDER.length;

  return (
    <div className="shell-inner !gap-8">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: nammaEase }}
        className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-challenge-soft via-white to-explore-soft p-8 shadow-[var(--shadow-float)] md:p-10"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-challenge/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-explore/25 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-challenge/30 bg-challenge-soft px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
              <Target className="h-3 w-3" /> Missions Hub
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              <span className="bg-gradient-to-r from-challenge via-bonus to-explore bg-clip-text text-transparent">
                Three missions
              </span>{" "}
              await you this week, {profileName}.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              A mission is one creative pursuit — your weekly journey, a short
              companion prompt from Neo, Dev or Anaya, and a stretch creator
              challenge once you finish the week.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/activities">
                  {weekComplete ? "Replay this week" : "Continue this week"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-2 font-display text-sm font-bold text-xp">
                <Zap className="h-4 w-4" /> {xp.toLocaleString()} XP
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-2 font-display text-sm font-bold text-success">
                <Flame className="h-4 w-4" /> {streak}-week streak
              </span>
            </div>
          </div>

          <div className="relative hidden h-56 items-end justify-center md:flex">
            <motion.img
              src={devThinking}
              alt="Dev"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-2 left-2 h-40 w-40 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]"
            />
            <motion.img
              src={neoCelebrating}
              alt="Neo"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-48 w-48 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
            />
            <motion.img
              src={anayaHappy}
              alt="Anaya"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-2 right-2 h-40 w-40 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]"
            />
          </div>
        </div>
      </motion.section>

      {/* MISSION #1 — Weekly journey */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <span className="rounded-full bg-foreground px-2.5 py-1 font-display text-xs font-bold text-background">
            Mission 01
          </span>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Complete this week&apos;s adventure
          </h2>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: nammaEase }}
          className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[var(--shadow-soft)] backdrop-blur md:p-8"
        >
          <div className="pointer-events-none absolute -top-20 right-0 h-44 w-44 rounded-full bg-explore/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Week 9 · The AI Adventure
              </div>
              <div className="mt-1 font-display text-xl font-extrabold text-foreground">
                {coreDone} of {ACTIVITY_ORDER.length} activities complete
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-success-soft px-3 py-1.5 font-display text-sm font-bold text-success">
              <Sparkles className="h-4 w-4" /> {corePct}%
            </div>
          </div>
          <div className="relative mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${corePct}%` }}
              transition={{ duration: 0.9, ease: nammaEase }}
              className="h-full rounded-full bg-gradient-to-r from-explore via-success to-bonus"
            />
          </div>
          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITY_ORDER.map((slug) => {
              const def = ACTIVITIES[slug];
              const m = def.meta;
              const done = completed.has(slug);
              return (
                <Link
                  key={slug}
                  to={"/activities/$slug"}
                  params={{ slug }}
                  className={cn(
                    "group rounded-2xl border bg-white/85 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
                    done ? "border-success/40" : `border-${m.tone}/25`,
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
                        `bg-${m.tone}-soft text-${m.tone}`,
                      )}
                    >
                      <span className="mr-0.5">{def.emoji}</span> {m.weekLabel}
                    </span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <span className={cn("h-2 w-2 rounded-full", `bg-${m.tone}`)} />
                    )}
                  </div>
                  <div className="mt-2 font-display text-sm font-bold text-foreground">
                    {m.title}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{m.totalXp} XP</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* MISSION #2 — Companion missions */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <span className="rounded-full bg-foreground px-2.5 py-1 font-display text-xs font-bold text-background">
            Mission 02
          </span>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Your companion prompts
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            · short, daily, 2-minute moments
          </span>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {COMPANION_MISSIONS.map((m, i) => {
            const isDone = doneCompanion.has(m.id);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: nammaEase }}
                className={cn(
                  "relative overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                  `border-${m.tone}/25`,
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl",
                    `bg-${m.tone}/30`,
                  )}
                />
                <div className="relative flex items-center gap-3">
                  <img
                    src={CHARACTER_IMG[m.character]}
                    alt={m.character}
                    className="h-14 w-14 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]"
                  />
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      {m.character === "neo" ? "Neo" : m.character === "dev" ? "Dev" : "Anaya"} says
                    </div>
                    <div className="font-display text-base font-extrabold text-foreground">
                      {m.title}
                    </div>
                  </div>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
                <div className="relative mt-4 flex items-center justify-between">
                  <span className={cn("text-[0.65rem] font-bold uppercase tracking-[0.18em]", `text-${m.tone}`)}>
                    {m.reward}
                  </span>
                  <Button
                    size="sm"
                    variant={isDone ? "soft" : "default"}
                    onClick={() => {
                      if (isDone) return;
                      setDoneCompanion((p) => new Set(p).add(m.id));
                      toast.success(`${m.reward}`, {
                        description: `${m.character === "neo" ? "Neo" : m.character === "dev" ? "Dev" : "Anaya"} loved your answer!`,
                      });
                    }}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Sent
                      </>
                    ) : (
                      m.cta
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MISSION #3 — Creator stretch */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <span className="rounded-full bg-foreground px-2.5 py-1 font-display text-xs font-bold text-background">
            Mission 03
          </span>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Stretch into creator mode
          </h2>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: nammaEase }}
          className={cn(
            "relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 shadow-[var(--shadow-soft)] backdrop-blur md:p-8",
            weekComplete
              ? "border-bonus/40 from-bonus-soft via-white to-challenge-soft"
              : "border-foreground/10 from-muted/40 via-white to-muted/30",
          )}
        >
          <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-bonus/30 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em]",
                  weekComplete
                    ? "border border-bonus/30 bg-bonus-soft text-bonus"
                    : "border border-foreground/15 bg-white/80 text-muted-foreground",
                )}
              >
                {weekComplete ? (
                  <>
                    <Rocket className="h-3 w-3" /> Unlocked
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" /> Locked for now
                  </>
                )}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-foreground">
                {weekComplete
                  ? "Three creator challenges are waiting."
                  : "Finish the week to unlock creator challenges."}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {weekComplete
                  ? "Take what you learned and build, design, or imagine — your tier's elite challenges live inside this week's adventure."
                  : `Complete all six core activities first. Only ${ACTIVITY_ORDER.length - coreDone} to go!`}
              </p>
              <div>
                <Button variant={weekComplete ? "hero" : "soft"} asChild>
                  <Link to="/activities">
                    {weekComplete ? "Enter creator mode" : "Continue activities"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-bonus/30 to-challenge/30 blur-3xl" />
              <Trophy className="relative h-28 w-28 text-bonus drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)]" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* footer encouragement */}
      <section className="rounded-[24px] border border-dashed border-foreground/10 bg-white/60 p-5 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-xp" />
          Pro tip
        </div>
        <p className="mt-2 text-sm text-foreground/80">
          One full week takes about <strong>30 minutes</strong> — perfect for a single computer-lab session.
        </p>
        <div className="mt-3">
          <Button variant="ghost" asChild>
            <Link to="/journey">
              <Compass className="mr-1 h-4 w-4" /> See all 35 weeks
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function _Page() {
  return (
    <AppShell>
      <MissionsPage />
    </AppShell>
  );
}

// Wrap with AppShell at the route boundary so the page-level layout matches other routes.
Route.update({ component: () => <AppShell><MissionsPage /></AppShell> });
