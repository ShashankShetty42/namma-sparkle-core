import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Compass,
  Crown,
  Flame,
  Lock,
  Search,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { ACTIVITIES, ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import { getCompleted } from "@/components/namma/activity/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";

import devHappy from "@/assets/characters/dev-happy.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Journey · Namma AI" },
      { name: "description", content: "Your 35-week AI adventure on Namma AI — every week a new world, every activity a new skill." },
    ],
  }),
  component: JourneyPage,
});

/* ---------- 35-week curriculum ---------- */

type WeekTone = "story" | "explore" | "decide" | "reflect" | "challenge" | "xp" | "success" | "bonus";

type Week = {
  n: number;
  title: string;
  theme: string;
  tone: WeekTone;
  emoji: string;
  milestone?: string;
};

const TONE_CYCLE: WeekTone[] = ["story", "explore", "decide", "reflect", "challenge", "xp"];

const WEEK_DATA: { title: string; theme: string; emoji: string; milestone?: string }[] = [
  { title: "What is AI?", theme: "Meet AI in your everyday life", emoji: "🤖" },
  { title: "How AI Learns", theme: "Data, patterns and predictions", emoji: "🧠" },
  { title: "Smart Machines", theme: "From toys to talking devices", emoji: "🦾" },
  { title: "Vision & Voice", theme: "How AI sees and hears", emoji: "👁️" },
  { title: "Recommendations", theme: "Why YouTube knows you", emoji: "🎯", milestone: "Month 1 badge" },
  { title: "AI in Games", theme: "NPCs, bots and clever play", emoji: "🎮" },
  { title: "Chatbots & You", theme: "Talking to AI the smart way", emoji: "💬" },
  { title: "AI Art & Music", theme: "Creativity with a machine partner", emoji: "🎨" },
  { title: "The AI Adventure", theme: "Story, ethics, write & quiz", emoji: "✨", milestone: "Explorer arc" },
  { title: "AI in Schools", theme: "Homework, tutors & fairness", emoji: "🏫" },
  { title: "AI in Hospitals", theme: "How AI saves lives", emoji: "🏥", milestone: "Month 2 badge" },
  { title: "AI in Sports", theme: "Coaches, stats and replays", emoji: "🏅" },
  { title: "Smart Cities", theme: "Traffic, energy & safety", emoji: "🌆" },
  { title: "AI & Nature", theme: "Protecting forests and oceans", emoji: "🌿" },
  { title: "AI Ethics 101", theme: "Bias, fairness and you", emoji: "⚖️", milestone: "Ethics Champion" },
  { title: "Privacy & Data", theme: "Your data, your power", emoji: "🔐" },
  { title: "Deepfakes", theme: "Spotting fake from real", emoji: "🕵️" },
  { title: "AI & Jobs", theme: "Careers of the future", emoji: "💼", milestone: "Month 4 badge" },
  { title: "Build a Bot", theme: "Design your first chatbot", emoji: "🤝" },
  { title: "Train an AI", theme: "Teach a model with examples", emoji: "🧪" },
  { title: "Prompting Power", theme: "Talk to AI like a pro", emoji: "💡" },
  { title: "AI + Science", theme: "Discoveries powered by AI", emoji: "🔬" },
  { title: "AI + Climate", theme: "Fighting climate change", emoji: "🌍", milestone: "Month 5 badge" },
  { title: "AI & Language", theme: "Translate the whole world", emoji: "🗣️" },
  { title: "AI in Stories", theme: "Co-write with a machine", emoji: "📖" },
  { title: "Robotics Day", theme: "When AI meets motion", emoji: "🤖" },
  { title: "AI & Space", theme: "Rovers, telescopes & stars", emoji: "🚀" },
  { title: "AI Safety", theme: "Keeping AI on our side", emoji: "🛡️", milestone: "Safety Hero" },
  { title: "AI Founders", theme: "Kids building real AI", emoji: "🚀" },
  { title: "Your AI Idea", theme: "Pitch an AI for your city", emoji: "💭", milestone: "Month 7 badge" },
  { title: "Capstone Plan", theme: "Design your final project", emoji: "📐" },
  { title: "Capstone Build", theme: "Make your project real", emoji: "🔨" },
  { title: "Capstone Polish", theme: "Refine, test, improve", emoji: "✨" },
  { title: "Showcase Day", theme: "Present to friends & family", emoji: "🎤" },
  { title: "Graduation", theme: "You're an AI Adventurer!", emoji: "🎓", milestone: "Final crown" },
];

const WEEKS: Week[] = WEEK_DATA.map((w, i) => ({
  n: i + 1,
  ...w,
  tone: TONE_CYCLE[i % TONE_CYCLE.length],
}));

const CURRENT_WEEK = 9;

function JourneyPage() {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const load = () => setCompleted(new Set(getCompleted()));
    load();
    window.addEventListener("namma:progress", load);
    return () => window.removeEventListener("namma:progress", load);
  }, []);

  const week9AllDone =
    ACTIVITY_ORDER.every((s) => completed.has(s)) && completed.size >= ACTIVITY_ORDER.length;

  const status = (n: number): "done" | "current" | "locked" => {
    if (n < CURRENT_WEEK) return "done";
    if (n === CURRENT_WEEK) return week9AllDone ? "done" : "current";
    if (n === CURRENT_WEEK + 1 && week9AllDone) return "current";
    return "locked";
  };

  const filtered = WEEKS;


  const doneCount = WEEKS.filter((w) => status(w.n) === "done").length;
  const progressPct = Math.round((doneCount / WEEKS.length) * 100);

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-story-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-story/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-2xl">
                  <Link to="/">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full bg-explore/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
                  <Compass className="h-3 w-3" /> Your Learning Journey
                </div>
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
                <span className="bg-gradient-to-r from-explore via-story to-decide bg-clip-text text-transparent">35 weeks</span> of AI adventures
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Every week unlocks a brand-new world — with the same six magical activities you love: Story, Explore, Decide, Write, Ethics and Quiz. Built with Dev, Neo and Anaya.
              </p>

              {/* Overall progress rail */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Overall progress</span>
                  <span className="text-foreground">{doneCount} / {WEEKS.length} weeks</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: nammaEase }}
                    className="h-full rounded-full bg-gradient-to-r from-explore via-story to-success shadow-[0_0_18px_rgba(0,0,0,0.15)]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/activities">
                    Jump to Week {week9AllDone ? CURRENT_WEEK + 1 : CURRENT_WEEK} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-2 font-display text-sm font-bold text-xp">
                  <Star className="h-4 w-4" /> {progressPct}% complete
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-2 font-display text-sm font-bold text-success">
                  <Flame className="h-4 w-4" /> 9-week streak
                </span>
              </div>
            </div>

            <div className="relative hidden h-56 items-end justify-center md:flex">
              <motion.img src={devHappy} alt="Dev" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="absolute bottom-2 left-2 h-40 w-40 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]" />
              <motion.img src={neoCelebrating} alt="Neo" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="relative h-48 w-48 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
              <motion.img src={anayaHappy} alt="Anaya" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="absolute bottom-2 right-2 h-40 w-40 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.16)]" />
            </div>
          </div>
        </motion.section>

        {/* Filters hidden in Phase 1 */}


        {/* WEEKS GRID */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((w, i) => {
            const s = status(w.n);
            const isCurrent = s === "current";
            const isDone = s === "done";
            const isLocked = s === "locked";

            const card = (
              <motion.div
                key={w.n}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i, duration: 0.4, ease: nammaEase }}
                className={cn(
                  "group relative h-full overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all",
                  !isLocked && "hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                  isCurrent
                    ? `border-${w.tone}/60 ring-2 ring-${w.tone}/40`
                    : isDone
                      ? "border-success/30"
                      : `border-${w.tone}/20`,
                  isLocked && "opacity-60",
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -top-14 -right-14 h-36 w-36 rounded-full blur-3xl transition-opacity",
                    isCurrent ? `bg-${w.tone}/40 opacity-90` : `bg-${w.tone}/25 opacity-60 group-hover:opacity-90`,
                  )}
                />

                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    <span className={cn("inline-block h-1.5 w-1.5 rounded-full", `bg-${w.tone}`)} />
                    Week {w.n}
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : isCurrent ? (
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", `bg-${w.tone}/50`)} />
                      <Circle className={cn("relative h-5 w-5", `text-${w.tone}`)} />
                    </span>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="relative mt-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[var(--shadow-soft)]",
                      `bg-gradient-to-br from-${w.tone} to-${w.tone}/70 text-white`,
                    )}
                  >
                    <span className="drop-shadow-sm">{w.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-bold leading-tight text-foreground">
                      {w.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {w.theme}
                    </p>
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold", `bg-${w.tone}-soft text-${w.tone}`)}>
                    6 activities
                  </span>
                  {w.milestone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-xp-soft px-2 py-0.5 text-[0.6rem] font-bold text-xp">
                      <Crown className="h-2.5 w-2.5" /> {w.milestone}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-background">
                      <Sparkles className="h-2.5 w-2.5" /> Current
                    </span>
                  )}
                </div>

                {!isLocked && (
                  <div className={cn("relative mt-4 flex items-center justify-between text-xs font-bold", `text-${w.tone}`)}>
                    <span>{isDone ? "Replay week" : "Enter week"}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
                {isLocked && (
                  <div className="relative mt-4 text-xs font-bold text-muted-foreground">
                    Unlocks after Week {w.n - 1}
                  </div>
                )}
              </motion.div>
            );

            if (isLocked) return <div key={w.n}>{card}</div>;
            // For now, all unlocked weeks lead to the Week 9 hub
            return (
              <Link key={w.n} to="/activities" className="block h-full">
                {card}
              </Link>
            );
          })}
        </section>

        {filtered.length === 0 && (
          <div className="rounded-[26px] border border-dashed border-muted-foreground/30 bg-white/60 p-10 text-center">
            <Trophy className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-display text-lg font-bold text-foreground">No weeks match that yet</p>
            <p className="text-sm text-muted-foreground">Try a different search or clear the filter.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
