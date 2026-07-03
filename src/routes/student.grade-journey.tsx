import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flame,
  Lock,
  Map as MapIcon,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  COMPLETION_PHASES,
  getCompletion,
  onCompletionState,
} from "@/lib/namma-completion";
import {
  getMissionsForGrade,
  gradeLabelToNumber,
  MISSIONS_PER_GRADE,
  SELF_SCHOOL,
  SELF_STUDENT,
} from "@/lib/namma-missions";
import { getProfile, onNammaState } from "@/lib/namma-progress";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";

export const Route = createFileRoute("/student/grade-journey")({
  head: () => ({
    meta: [
      { title: "My Grade Journey · Namma AI" },
      {
        name: "description",
        content:
          "Eight guided missions for your grade — workbook, portal activities, quizzes, reflection and a project. Complete them at your pace.",
      },
    ],
  }),
  component: GradeJourneyPage,
});

function useSnapshot() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const offC = onCompletionState(bump);
    const offN = onNammaState(bump);
    return () => {
      offC();
      offN();
    };
  }, []);
  return tick;
}

function GradeJourneyPage() {
  const tick = useSnapshot();
  const { grade, gradeLabel, missions, studentName } = React.useMemo(() => {
    const p = getProfile();
    const g = gradeLabelToNumber(p.gradeLabel);
    return {
      grade: g,
      gradeLabel: p.gradeLabel,
      missions: getMissionsForGrade(g),
      studentName: p.name || "Explorer",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const progress = React.useMemo(() => {
    return missions.map((m) => {
      const state = getCompletion(SELF_SCHOOL, SELF_STUDENT, gradeLabel, m.index);
      const done = COMPLETION_PHASES.filter((p) => state[p]).length;
      const approved = state.approval;
      return { state, done, approved };
    });
  }, [missions, gradeLabel, tick]);

  const totalDone = progress.filter((p) => p.approved).length;
  const overallPct = Math.round(
    (progress.reduce((acc, p) => acc + p.done, 0) /
      (MISSIONS_PER_GRADE * COMPLETION_PHASES.length)) *
      100,
  );

  // Locked if the previous mission's approval isn't done (mission 1 always open).
  function isLocked(index: number) {
    if (index === 1) return false;
    return !progress[index - 2]?.approved;
  }

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-story-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-story/25 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-explore/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
                <MapIcon className="h-3 w-3" /> {gradeLabel} journey
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                Hey {studentName}, ready for{" "}
                <span className="bg-gradient-to-r from-explore via-story to-reflect bg-clip-text text-transparent">
                  mission {Math.min(totalDone + 1, MISSIONS_PER_GRADE)}
                </span>
                ?
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Every mission has 6 tiny steps — workbook, portal activity, quiz, reflection,
                project and teacher approval. Take one at a time. You've got this.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-foreground/5 bg-white/85 px-4 py-2.5 shadow-[var(--shadow-soft)]">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Missions approved
                  </div>
                  <div className="mt-1 flex items-baseline gap-1 font-reward text-2xl leading-none text-foreground">
                    {totalDone}
                    <span className="text-sm text-muted-foreground">/ {MISSIONS_PER_GRADE}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-foreground/5 bg-white/85 px-4 py-2.5 shadow-[var(--shadow-soft)]">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Overall
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-explore via-story to-reflect"
                        style={{ width: `${overallPct}%` }}
                      />
                    </div>
                    <span className="font-reward text-lg leading-none text-foreground">
                      {overallPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden h-64 items-end justify-center md:flex">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm" />
              <motion.img
                src={neoCelebrating}
                alt="Neo"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-52 w-52 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
        </motion.section>

        {/* Mission trail */}
        <section className="section-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">
                <Compass className="h-3.5 w-3.5" /> Mission trail
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                Your {gradeLabel} adventure
              </h2>
            </div>
            <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              8 missions · 6 steps each
            </div>
          </div>

          <div className="relative mt-6">
            {/* trail line */}
            <div
              className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-gradient-to-b from-explore/60 via-story/60 to-reflect/60 md:block"
              aria-hidden
            />
            <ol className="space-y-4">
              {missions.map((m, i) => {
                const locked = isLocked(m.index);
                const p = progress[i];
                const percent = Math.round((p.done / COMPLETION_PHASES.length) * 100);
                return (
                  <motion.li
                    key={m.index}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "relative rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-soft)] transition-shadow md:pl-16 md:pr-5 md:py-5",
                      !locked && "hover:shadow-[var(--shadow-float)]",
                      locked && "opacity-70",
                    )}
                  >
                    {/* Node marker */}
                    <span
                      className={cn(
                        "absolute left-4 top-4 hidden h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-[var(--shadow-soft)] md:flex",
                        p.approved
                          ? "bg-success text-white"
                          : locked
                            ? "bg-foreground/15 text-foreground/40"
                            : "bg-gradient-to-br from-explore to-reflect text-white",
                      )}
                    >
                      {p.approved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : locked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <span className="font-reward text-sm">{m.index}</span>
                      )}
                    </span>

                    <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto] md:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Mission {m.index}
                          </span>
                          <span className="rounded-full bg-explore-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-explore">
                            {m.track}
                          </span>
                          {p.approved ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-success">
                              <Trophy className="h-3 w-3" /> Approved
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 font-display text-lg font-extrabold text-foreground">
                          {m.title}
                        </div>
                        <div className="mt-0.5 text-sm text-muted-foreground">
                          Focus · {m.focus}
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          {COMPLETION_PHASES.map((ph) => (
                            <span
                              key={ph}
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.16em]",
                                p.state[ph]
                                  ? "border-success/30 bg-success-soft text-success"
                                  : "border-foreground/10 bg-foreground/[0.03] text-muted-foreground",
                              )}
                            >
                              {ph}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-explore via-story to-reflect"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[0.65rem] font-bold text-muted-foreground">
                            {percent}%
                          </span>
                        </div>
                      </div>

                      <div className="md:pl-3">
                        {locked ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            <Lock className="h-3 w-3" /> Locked
                          </div>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant={p.approved ? "soft" : "hero"}
                          >
                            <Link
                              to="/student/mission/$missionIndex"
                              params={{ missionIndex: String(m.index) }}
                            >
                              {p.approved ? (
                                <>
                                  <Star className="h-3.5 w-3.5" /> Review
                                </>
                              ) : p.done > 0 ? (
                                <>
                                  <Flame className="h-3.5 w-3.5" /> Continue
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" /> Start
                                </>
                              )}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          <p className="mt-6 text-[0.7rem] leading-relaxed text-muted-foreground">
            {LEGAL_TAGLINES.short}
          </p>
        </section>
      </div>
    </AppShell>
  );
}
