import * as React from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Flame, Lock, Sparkles, Star, Trophy } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { ACTIVITIES, ACTIVITY_ORDER, HUB_ICONS } from "@/components/namma/activity/lesson-data";
import { getCompleted } from "@/components/namma/activity/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Week 9 Journey · Namma AI" },
      { name: "description", content: "Your premium Week 9 AI adventure — story, exploration, ethics, writing, and a final quiz, hosted by Dev, Neo and Anaya." },
    ],
  }),
  component: ActivitiesHub,
});

function ActivitiesHub() {
  const location = useLocation();
  const totalXp = ACTIVITY_ORDER.reduce((s, k) => s + ACTIVITIES[k].meta.totalXp, 0);

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

  const nextUpSlug =
    ACTIVITY_ORDER.find((s) => !completed.has(s)) ?? ACTIVITY_ORDER[0];
  const allDone = completed.size >= ACTIVITY_ORDER.length;

  if (location.pathname !== "/activities") return <Outlet />;

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-explore-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-story/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-explore/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-story/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-story">
                <Sparkles className="h-3 w-3" /> Week 9 · The AI Adventure
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
                Become an <span className="bg-gradient-to-r from-story via-reflect to-decide bg-clip-text text-transparent">AI Explorer</span> this week
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Six magical activities, three friendly guides, and a whole week of discovery. Finish them all to unlock the legendary Week 9 badge.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/activities/$slug" params={{ slug: nextUpSlug }}>
                    {allDone
                      ? <>Replay journey <ArrowRight className="h-5 w-5" /></>
                      : completed.size === 0
                        ? <>Begin journey <ArrowRight className="h-5 w-5" /></>
                        : <>Continue: {ACTIVITIES[nextUpSlug].meta.title} <ArrowRight className="h-5 w-5" /></>}
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-2 font-display text-sm font-bold text-xp">
                  <Star className="h-4 w-4" /> {totalXp} XP available
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-2 font-display text-sm font-bold text-success">
                  <Flame className="h-4 w-4" /> {completed.size}/{ACTIVITY_ORDER.length} done
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

        {/* ACTIVITY PATH */}
        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Your path</div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">6 activities, one journey</h2>
            </div>
            <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground md:flex">
              <Trophy className="h-4 w-4 text-xp" /> Complete in order for streak bonus
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ACTIVITY_ORDER.map((slug, i) => {
              const a = ACTIVITIES[slug];
              const Icon = HUB_ICONS[slug];
              const isCompleted = completed.has(slug);
              const prevDone = i === 0 || completed.has(ACTIVITY_ORDER[i - 1]);
              const locked = !isCompleted && !prevDone;
              const completedFlag = isCompleted;
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: nammaEase }}
                >
                  <Link
                    to="/activities/$slug"
                    params={{ slug }}
                    className={cn(
                      "group relative block overflow-hidden rounded-[28px] border bg-white/85 p-6 shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                      `border-${a.meta.tone}/25 hover:border-foreground/30`,
                      locked && "pointer-events-none opacity-60",
                    )}
                  >
                    <div className={cn("pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-50 blur-3xl transition-opacity group-hover:opacity-80", `bg-${a.meta.tone}/35`)} />
                    <div className="relative flex items-start gap-4">
                      <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-soft)]", `bg-gradient-to-br from-${a.meta.tone} to-${a.meta.tone}/70`)}>
                        {locked ? <Lock className="h-5 w-5" /> : <Icon className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                          <span className={cn("inline-block h-1.5 w-1.5 rounded-full", `bg-${a.meta.tone}`)} />
                          Activity {a.meta.activityNumber} · {a.meta.weekLabel}
                          {completedFlag && (
                            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-success-soft px-1.5 py-0.5 text-[0.55rem] text-success">
                              <Trophy className="h-2.5 w-2.5" /> Done
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 font-display text-xl font-bold leading-tight text-foreground">
                          {a.emoji} {a.meta.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{a.blurb}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-bold", `bg-${a.meta.tone}-soft text-${a.meta.tone}`)}>
                            <Star className="h-3 w-3" /> +{a.meta.totalXp} XP
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-bold text-muted-foreground">
                            <Trophy className="h-3 w-3" /> {a.meta.badge}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={cn("h-5 w-5 shrink-0 self-center transition-transform group-hover:translate-x-1", `text-${a.meta.tone}`)} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
