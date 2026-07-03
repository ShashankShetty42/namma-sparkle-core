import * as React from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Copy,
  FolderKanban,
  Lock,
  MessageSquare,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  COMPLETION_PHASES,
  getCompletion,
  onCompletionState,
  setPhase,
  type CompletionPhase,
} from "@/lib/namma-completion";
import {
  getMissionsForGrade,
  getOrCreateCompletionCode,
  gradeLabelToNumber,
  MISSIONS_PER_GRADE,
  SELF_SCHOOL,
  SELF_STUDENT,
} from "@/lib/namma-missions";
import { getProfile, onNammaState } from "@/lib/namma-progress";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";

export const Route = createFileRoute("/student/mission/$missionIndex")({
  head: ({ params }) => ({
    meta: [{ title: `Mission ${params.missionIndex} · Namma AI` }],
  }),
  component: MissionDetail,
});

const PHASE_META: Record<
  CompletionPhase,
  {
    label: string;
    tone: "reflect" | "explore" | "decide" | "story" | "challenge" | "success";
    icon: React.ComponentType<{ className?: string }>;
    lead: string;
    body: (m: {
      workbookPages: string;
      portalActivity: string;
      quizTitle: string;
      reflectionPrompt: string;
      projectPrompt: string;
    }) => string;
    actionable: boolean;
  }
> = {
  workbook: {
    label: "Workbook",
    tone: "reflect",
    icon: BookOpen,
    lead: "Read & try",
    body: (m) => `Open your workbook to ${m.workbookPages} and finish the exercises.`,
    actionable: true,
  },
  portal: {
    label: "Portal activity",
    tone: "explore",
    icon: Compass,
    lead: "Explore online",
    body: (m) => `${m.portalActivity} — a short interactive on the portal.`,
    actionable: true,
  },
  quiz: {
    label: "Quiz",
    tone: "decide",
    icon: ClipboardCheck,
    lead: "Show what you know",
    body: (m) => `${m.quizTitle} — 5 quick questions.`,
    actionable: true,
  },
  reflection: {
    label: "Reflection",
    tone: "story",
    icon: MessageSquare,
    lead: "Think & write",
    body: (m) => m.reflectionPrompt,
    actionable: true,
  },
  project: {
    label: "Project",
    tone: "challenge",
    icon: FolderKanban,
    lead: "Make something",
    body: (m) => m.projectPrompt,
    actionable: true,
  },
  approval: {
    label: "Teacher approval",
    tone: "success",
    icon: ShieldCheck,
    lead: "Wait for teacher",
    body: () =>
      "Your teacher will review everything and give the final tick. You'll see your completion code below when it's approved.",
    actionable: false,
  },
};

function useTick() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setT((x) => x + 1);
    const a = onCompletionState(bump);
    const b = onNammaState(bump);
    return () => {
      a();
      b();
    };
  }, []);
  return t;
}

function MissionDetail() {
  const { missionIndex } = useParams({ from: "/student/mission/$missionIndex" });
  const tick = useTick();

  const parsed = Math.max(1, Math.min(MISSIONS_PER_GRADE, parseInt(missionIndex, 10) || 1));

  const { grade, gradeLabel, mission, studentName, state, prevApproved } = React.useMemo(() => {
    const p = getProfile();
    const g = gradeLabelToNumber(p.gradeLabel);
    const missions = getMissionsForGrade(g);
    const m = missions[parsed - 1];
    const s = getCompletion(SELF_SCHOOL, SELF_STUDENT, p.gradeLabel, parsed);
    const prev =
      parsed === 1
        ? true
        : getCompletion(SELF_SCHOOL, SELF_STUDENT, p.gradeLabel, parsed - 1).approval;
    return {
      grade: g,
      gradeLabel: p.gradeLabel,
      mission: m,
      studentName: p.name || "Explorer",
      state: s,
      prevApproved: prev,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, parsed]);

  const doneCount = COMPLETION_PHASES.filter((ph) => state[ph]).length;
  const percent = Math.round((doneCount / COMPLETION_PHASES.length) * 100);
  const allStudentPhasesDone = COMPLETION_PHASES.filter((p) => p !== "approval").every(
    (p) => state[p],
  );

  const code = state.approval
    ? getOrCreateCompletionCode(grade, parsed, studentName)
    : null;

  function toggle(ph: CompletionPhase) {
    if (!PHASE_META[ph].actionable) return;
    setPhase(SELF_SCHOOL, SELF_STUDENT, gradeLabel, parsed, ph, !state[ph]);
  }

  if (!prevApproved) {
    return (
      <AppShell>
        <div className="shell-inner !gap-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[var(--shadow-soft)]">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.05] text-muted-foreground">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
              Mission {parsed} is locked
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Finish and get teacher approval on mission {parsed - 1} first — then this one opens up.
            </p>
            <Button asChild variant="hero" size="sm" className="mt-4">
              <Link to="/student/grade-journey">
                <ArrowLeft className="h-4 w-4" /> Back to journey
              </Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-story-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/25 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="-ml-2">
                <Link to="/student/grade-journey">
                  <ArrowLeft className="h-4 w-4" /> Journey
                </Link>
              </Button>
              <span className="rounded-full bg-explore/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
                {gradeLabel} · Mission {parsed}
              </span>
              <span className="rounded-full bg-story/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-story">
                {mission.track}
              </span>
              {state.approval ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-success">
                  <Trophy className="h-3 w-3" /> Approved
                </span>
              ) : null}
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
              {mission.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Focus · <span className="font-semibold text-foreground">{mission.focus}</span>. Tick
              each step as you go — your teacher will approve the last one.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-foreground/5 bg-white/85 px-4 py-2.5 shadow-[var(--shadow-soft)]">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Mission progress
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-explore via-story to-reflect"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="font-reward text-lg leading-none text-foreground">
                    {percent}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {doneCount} of {COMPLETION_PHASES.length} steps done
              </div>
            </div>
          </div>
        </motion.section>

        {/* Phases */}
        <section className="grid gap-3 md:grid-cols-2">
          {COMPLETION_PHASES.map((ph, i) => {
            const meta = PHASE_META[ph];
            const Icon = meta.icon;
            const done = state[ph];
            const locked = ph === "approval" && !allStudentPhasesDone;
            return (
              <motion.div
                key={ph}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[var(--shadow-soft)]",
                  done && "ring-1 ring-success/40",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl",
                      `bg-${meta.tone}-soft text-${meta.tone}`,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Step {i + 1} · {meta.lead}
                    </div>
                    <div className="mt-0.5 font-display text-base font-extrabold text-foreground">
                      {meta.label}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{meta.body(mission)}</p>
                    <div className="mt-3">
                      {meta.actionable ? (
                        <Button
                          size="sm"
                          variant={done ? "soft" : "hero"}
                          onClick={() => toggle(ph)}
                        >
                          {done ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Done — undo
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" /> Mark as done
                            </>
                          )}
                        </Button>
                      ) : (
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
                            done
                              ? "border-success/30 bg-success-soft text-success"
                              : locked
                                ? "border-foreground/10 bg-foreground/[0.03] text-muted-foreground"
                                : "border-decide/30 bg-decide-soft text-decide",
                          )}
                        >
                          {done ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Teacher approved
                            </>
                          ) : locked ? (
                            <>
                              <Lock className="h-3 w-3" /> Finish steps 1–5 first
                            </>
                          ) : (
                            <>
                              <NotebookPen className="h-3 w-3" /> Waiting for teacher
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Completion code */}
        {code ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[28px] border border-success/30 bg-gradient-to-br from-success-soft via-white to-story-soft p-6 shadow-[var(--shadow-float)]"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-success/25 blur-3xl" />
            <div className="relative grid gap-4 md:grid-cols-[1.4fr_auto] md:items-center">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-success">
                  <Trophy className="h-3 w-3" /> Mission complete
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground">
                  Your completion code
                </h3>
                <p className="max-w-lg text-sm text-muted-foreground">
                  Save this code — it's proof you finished mission {parsed}. Anyone can scan the QR
                  to open your verification page.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded-2xl border border-success/30 bg-white/95 px-4 py-3 font-mono text-base font-bold tracking-wider text-foreground shadow-[var(--shadow-soft)]">
                    {code}
                  </code>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText(code);
                      toast.success("Copied!");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button asChild variant="hero" size="sm">
                    <Link to="/verify/$code" params={{ code }}>
                      Open verify page
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="rounded-[20px] border border-white/70 bg-white p-3 shadow-[var(--shadow-soft)]">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(
                      typeof window !== "undefined"
                        ? `${window.location.origin}/verify/${code}`
                        : `/verify/${code}`,
                    )}`}
                    alt={`QR for ${code}`}
                    width={144}
                    height={144}
                    className="h-36 w-36 rounded-xl"
                  />
                  <div className="mt-1 text-center text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Scan to verify
                  </div>
                </div>
              </div>
            </div>

          </motion.section>
        ) : null}

        {/* Nav */}
        <section className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" disabled={parsed <= 1}>
            <Link
              to="/student/mission/$missionIndex"
              params={{ missionIndex: String(Math.max(1, parsed - 1)) }}
            >
              <ArrowLeft className="h-4 w-4" /> Previous mission
            </Link>
          </Button>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {LEGAL_TAGLINES.short}
          </p>
          <Button
            asChild
            variant={parsed >= MISSIONS_PER_GRADE ? "soft" : "hero"}
            size="sm"
            disabled={parsed >= MISSIONS_PER_GRADE}
          >
            <Link
              to="/student/mission/$missionIndex"
              params={{ missionIndex: String(Math.min(MISSIONS_PER_GRADE, parsed + 1)) }}
            >
              Next mission
            </Link>
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
