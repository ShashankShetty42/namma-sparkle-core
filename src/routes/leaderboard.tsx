import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Plus, Sparkles, Star, Trash2, Trophy, Users } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  type Classmate,
  getClassmates,
  getProfile,
  getTotalXP,
  getWeeklyStreak,
  onNammaState,
  saveClassmates,
} from "@/lib/namma-progress";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Class Heroes · Namma AI" },
      {
        name: "description",
        content:
          "Class Heroes this week — celebrate your classmates' weekly AI learning progress.",
      },
    ],
  }),
  component: LeaderboardPage,
});

type Row = {
  id: string;
  name: string;
  xp: number;
  isYou: boolean;
};

function LeaderboardPage() {
  const [classmates, setClassmates] = React.useState<Classmate[]>([]);
  const [myXp, setMyXp] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [myName, setMyName] = React.useState("You");
  const [newName, setNewName] = React.useState("");
  const [newXp, setNewXp] = React.useState("");

  React.useEffect(() => {
    const load = () => {
      setClassmates(getClassmates());
      setMyXp(getTotalXP());
      setStreak(getWeeklyStreak());
      setMyName(getProfile().name || "You");
    };
    load();
    const off = onNammaState(load);
    return off;
  }, []);

  const rows: Row[] = React.useMemo(() => {
    const mine: Row = { id: "me", name: myName, xp: myXp, isYou: true };
    const others: Row[] = classmates.map((c) => ({
      id: c.id,
      name: c.name,
      xp: c.xp,
      isYou: false,
    }));
    return [mine, ...others].sort((a, b) => b.xp - a.xp);
  }, [classmates, myXp, myName]);

  const addClassmate = () => {
    const name = newName.trim();
    const xp = Math.max(0, parseInt(newXp, 10) || 0);
    if (!name) return;
    const next: Classmate = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      xp,
    };
    saveClassmates([...classmates, next]);
    setNewName("");
    setNewXp("");
  };

  const removeClassmate = (id: string) => {
    saveClassmates(classmates.filter((c) => c.id !== id));
  };

  const myRank = rows.findIndex((r) => r.isYou) + 1;
  const totalXp = rows.reduce((s, r) => s + r.xp, 0);

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-xp-soft via-white to-bonus-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-xp/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-bonus/25 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-xp/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-xp">
                <Users className="h-3 w-3" /> Class Heroes · This Week
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
                Cheer on your{" "}
                <span className="bg-gradient-to-r from-xp via-bonus to-challenge bg-clip-text text-transparent">
                  classmates
                </span>
                .
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Add your classmates and their XP to celebrate this week's learners.
                Your own XP and streak are tracked automatically as you complete
                activities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Stat icon={Trophy} label="Your rank" value={`#${myRank}`} tone="xp" />
                <Stat icon={Star} label="Your XP" value={myXp.toLocaleString()} tone="bonus" />
                <Stat icon={Flame} label="Weekly streak" value={`${streak} wk${streak === 1 ? "" : "s"}`} tone="challenge" />
                <Stat icon={Users} label="Class size" value={String(rows.length)} tone="story" />
              </div>
            </div>

            <div className="relative hidden h-56 items-end justify-center md:flex">
              <motion.img
                src={neoCelebrating}
                alt="Neo cheering on the class"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-56 w-56 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_24px_40px_rgba(0,0,0,0.2)]"
              />
              <Sparkles className="absolute top-4 right-6 h-6 w-6 text-bonus animate-[namma-pulse_2.4s_ease-in-out_infinite]" />
            </div>
          </div>
        </motion.section>

        {/* PODIUM */}
        {rows.length >= 3 && <Podium top3={rows.slice(0, 3)} />}

        {/* TABLE */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Full class
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {rows.length} hero{rows.length === 1 ? "" : "es"} this week
              </h2>
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              Combined {totalXp.toLocaleString()} XP
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/85 backdrop-blur shadow-[var(--shadow-soft)]">
            <AnimatePresence initial={false}>
              {rows.map((r, i) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex items-center gap-4 border-b border-border/40 px-5 py-3 last:border-b-0",
                    r.isYou && "bg-xp/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold",
                      i === 0
                        ? "bg-gradient-to-br from-xp to-bonus text-white"
                        : i === 1
                        ? "bg-gradient-to-br from-explore to-story text-white"
                        : i === 2
                        ? "bg-gradient-to-br from-challenge to-decide text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display font-bold text-foreground">{r.name}</div>
                      {r.isYou && (
                        <span className="rounded-full bg-xp/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-xp">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-xp-soft px-2.5 py-1 font-display text-sm font-bold text-xp">
                    <Star className="h-3.5 w-3.5" /> {r.xp.toLocaleString()}
                  </div>
                  {!r.isYou && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${r.name}`}
                      onClick={() => removeClassmate(r.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ADD CLASSMATE */}
        <section className="rounded-[24px] border border-white/70 bg-gradient-to-br from-bonus-soft/60 via-white to-xp-soft/60 p-5 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Plus className="h-3 w-3" /> Add a classmate
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              placeholder="Classmate name (e.g. Priya)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="md:flex-1"
            />
            <Input
              type="number"
              min={0}
              placeholder="Their XP this week"
              value={newXp}
              onChange={(e) => setNewXp(e.target.value)}
              className="md:w-56"
            />
            <Button variant="hero" onClick={addClassmate} disabled={!newName.trim()}>
              Add hero <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Names and XP stay on this device. Use this with your class to celebrate
            weekly progress together.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border bg-white/80 px-3.5 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur",
        `border-${tone}/30`,
      )}
    >
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", `bg-${tone}/15 text-${tone}`)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-extrabold text-foreground">{value}</div>
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function Podium({ top3 }: { top3: Row[] }) {
  // Order: 2nd, 1st, 3rd visually
  const order = [top3[1], top3[0], top3[2]];
  const heights = ["h-32", "h-44", "h-24"];
  const tones = ["explore", "xp", "challenge"];
  return (
    <section className="grid grid-cols-3 items-end gap-3 md:gap-6">
      {order.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, ease: nammaEase }}
          className="flex flex-col items-center text-center"
        >
          <div className={cn("font-display text-base font-bold text-foreground", r.isYou && "underline")}>
            {r.name}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-xp">
            <Star className="h-3 w-3" /> {r.xp.toLocaleString()}
          </div>
          <div
            className={cn(
              "mt-3 flex w-full items-end justify-center rounded-t-3xl border border-white/70 bg-gradient-to-b text-white shadow-[var(--shadow-soft)]",
              heights[i],
              `from-${tones[i]} to-${tones[i]}/60`,
            )}
          >
            <div className="pb-3 font-display text-2xl font-extrabold">
              {i === 0 ? 2 : i === 1 ? 1 : 3}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
