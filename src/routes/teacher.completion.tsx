import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FolderKanban,
  GraduationCap,
  ListChecks,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";
import { getAuth, onNammaState } from "@/lib/namma-progress";
import {
  getSchool,
  getStudents,
  getTeachers,
  onAdminState,
  type Student,
} from "@/lib/namma-admin";
import {
  COMPLETION_PHASES,
  MISSIONS_PER_GRADE,
  getCompletion,
  onCompletionState,
  studentApprovedCount,
  studentPercent,
  togglePhase,
  type CompletionPhase,
} from "@/lib/namma-completion";

export const Route = createFileRoute("/teacher/completion")({
  head: () => ({
    meta: [
      { title: "Student Completion Tracker · Namma AI" },
      {
        name: "description",
        content:
          "Mark workbook, portal task, quiz, reflection, project and approval status per student across the CT & AI implementation weeks.",
      },
      { property: "og:title", content: "Student Completion Tracker · Namma AI" },
      {
        property: "og:description",
        content:
          "A per-student, per-mission completion matrix for CBSE CT & AI implementation.",
      },
    ],
  }),
  component: CompletionTrackerPage,
});

/* ─────────── UI meta ─────────── */

const PHASE_META: Record<
  CompletionPhase,
  { label: string; short: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  workbook: { label: "Workbook", short: "WB", icon: BookOpenCheck, tone: "explore" },
  portal: { label: "Portal task", short: "Portal", icon: Compass, tone: "decide" },
  quiz: { label: "Quiz", short: "Quiz", icon: ClipboardCheck, tone: "challenge" },
  reflection: { label: "Reflection", short: "Refl.", icon: NotebookPen, tone: "reflect" },
  project: { label: "Project", short: "Proj.", icon: FolderKanban, tone: "bonus" },
  approval: { label: "Teacher approval", short: "Approved", icon: ShieldCheck, tone: "success" },
};

const phaseButtonTone: Record<string, string> = {
  explore: "border-explore/30 bg-explore text-white",
  decide: "border-decide/30 bg-decide text-white",
  challenge: "border-challenge/30 bg-challenge text-white",
  reflect: "border-reflect/30 bg-reflect text-white",
  bonus: "border-bonus/30 bg-bonus text-white",
  success: "border-success/30 bg-success text-white",
};

/* ─────────── Component ─────────── */

function CompletionTrackerPage() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [schoolCode, setSchoolCode] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => {
      const a = getAuth();
      setEmail(a.email);
      setSchoolCode(a.schoolCode);
      setTick((t) => t + 1);
    };
    refresh();
    const offs = [onAdminState(refresh), onNammaState(refresh), onCompletionState(refresh)];
    return () => offs.forEach((o) => o());
  }, []);

  /* Resolve teacher → school. Fall back to auth.schoolCode (principal preview). */
  const teacher = React.useMemo(
    () =>
      email
        ? getTeachers().find(
            (t) => t.teacher_email.toLowerCase() === email.toLowerCase(),
          ) ?? null
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email, tick],
  );
  const effectiveSchoolCode = teacher?.school_id ?? schoolCode ?? null;
  const school = React.useMemo(
    () => (effectiveSchoolCode ? getSchool(effectiveSchoolCode) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSchoolCode, tick],
  );
  const students: Student[] = React.useMemo(
    () => (effectiveSchoolCode ? getStudents(effectiveSchoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSchoolCode, tick],
  );

  const grades = React.useMemo(() => {
    const set = new Set(students.map((s) => s.grade));
    return Array.from(set).sort();
  }, [students]);

  const [activeGrade, setActiveGrade] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!activeGrade && grades.length > 0) setActiveGrade(grades[0]);
    if (activeGrade && !grades.includes(activeGrade)) {
      setActiveGrade(grades[0] ?? null);
    }
  }, [grades, activeGrade]);

  const [activeMission, setActiveMission] = React.useState(1);

  const roster = React.useMemo(
    () => students.filter((s) => s.grade === activeGrade),
    [students, activeGrade],
  );

  /* Aggregate KPIs for the active grade. */
  const gradeStats = React.useMemo(() => {
    if (!effectiveSchoolCode || !activeGrade) {
      return { avg: 0, approvedTotal: 0, totalPhases: 0, donePhases: 0 };
    }
    let sum = 0;
    let approved = 0;
    let done = 0;
    const totalPhases = roster.length * MISSIONS_PER_GRADE * COMPLETION_PHASES.length;
    for (const s of roster) {
      sum += studentPercent(effectiveSchoolCode, s.student_id, s.grade);
      approved += studentApprovedCount(effectiveSchoolCode, s.student_id, s.grade);
      for (let m = 1; m <= MISSIONS_PER_GRADE; m++) {
        const state = getCompletion(effectiveSchoolCode, s.student_id, s.grade, m);
        for (const p of COMPLETION_PHASES) if (state[p]) done++;
      }
    }
    return {
      avg: roster.length ? Math.round(sum / roster.length) : 0,
      approvedTotal: approved,
      totalPhases,
      donePhases: done,
    };
  }, [roster, effectiveSchoolCode, activeGrade, tick]);

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-reflect-soft via-white to-explore-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-reflect/25 bg-white/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-reflect">
                <Sparkles className="h-3.5 w-3.5" /> Teacher · Student Completion
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                Track every student, every mission.
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Mark workbook, portal task, quiz, reflection, project and approval status per
                student. Data feeds directly into teacher and principal reports.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <MetaChip icon={<GraduationCap className="h-3.5 w-3.5" />}>
                  {school ? school.school_name : "No school assigned"}
                </MetaChip>
                <MetaChip icon={<Users className="h-3.5 w-3.5" />}>
                  {students.length} students · {grades.length} grades
                </MetaChip>
                <MetaChip icon={<ListChecks className="h-3.5 w-3.5" />}>
                  {MISSIONS_PER_GRADE} missions × 6 phases
                </MetaChip>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link
                to="/teacher/planner"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white"
              >
                <ClipboardList className="h-4 w-4" /> Weekly planner
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Empty-state early-out */}
        {students.length === 0 ? (
          <EmptyState schoolAssigned={!!school} />
        ) : (
          <>
            {/* KPIs for active grade */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                tone="explore"
                icon={<GraduationCap className="h-5 w-5" />}
                label="Class average"
                value={`${gradeStats.avg}%`}
                hint={`Across ${roster.length} students`}
              />
              <Kpi
                tone="success"
                icon={<ShieldCheck className="h-5 w-5" />}
                label="Approved missions"
                value={gradeStats.approvedTotal}
                hint="Verified by teacher"
              />
              <Kpi
                tone="challenge"
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Phases marked"
                value={`${gradeStats.donePhases}/${gradeStats.totalPhases}`}
                hint="Total tick-boxes complete"
              />
              <Kpi
                tone="decide"
                icon={<ListChecks className="h-5 w-5" />}
                label="Missions in view"
                value={MISSIONS_PER_GRADE}
                hint={`Mission ${activeMission} selected`}
              />
            </section>

            {/* Grade + mission selectors */}
            <section className="rounded-[28px] border border-foreground/10 bg-white/85 p-6 shadow-[var(--shadow-soft)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-explore">
                    Choose grade
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {grades.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setActiveGrade(g)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                          g === activeGrade
                            ? "border-foreground bg-foreground text-white"
                            : "border-foreground/15 bg-white text-foreground hover:bg-explore-soft",
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-decide sm:text-right">
                    Choose mission
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:justify-end">
                    {Array.from({ length: MISSIONS_PER_GRADE }, (_, i) => i + 1).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setActiveMission(m)}
                        className={cn(
                          "h-8 min-w-8 rounded-full border px-2 text-xs font-bold transition",
                          m === activeMission
                            ? "border-foreground bg-foreground text-white"
                            : "border-foreground/15 bg-white text-foreground hover:bg-decide-soft",
                        )}
                      >
                        M{m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase legend */}
              <div className="mt-5 flex flex-wrap gap-2">
                {COMPLETION_PHASES.map((p) => {
                  const meta = PHASE_META[p];
                  const Icon = meta.icon;
                  return (
                    <span
                      key={p}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
                        `border-${meta.tone}/25 bg-${meta.tone}-soft text-${meta.tone}`,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {meta.label}
                    </span>
                  );
                })}
              </div>
            </section>

            {/* Student matrix */}
            <section className="rounded-[28px] border border-foreground/10 bg-white/85 p-4 shadow-[var(--shadow-soft)] sm:p-6">
              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-reflect">
                    {activeGrade ?? "—"} · Mission {activeMission}
                  </p>
                  <h2 className="font-display text-xl font-extrabold text-foreground">
                    Tap a chip to mark or unmark
                  </h2>
                </div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {roster.length} students
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="w-[220px] px-3 py-2 text-left">Student</th>
                      <th className="px-3 py-2 text-left">This mission</th>
                      <th className="w-[120px] px-3 py-2 text-right">Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((s) => {
                      const state = effectiveSchoolCode
                        ? getCompletion(
                            effectiveSchoolCode,
                            s.student_id,
                            s.grade,
                            activeMission,
                          )
                        : { ...emptyState };
                      const pct = effectiveSchoolCode
                        ? studentPercent(effectiveSchoolCode, s.student_id, s.grade)
                        : 0;
                      return (
                        <tr key={s.student_id} className="border-t border-foreground/5">
                          <td className="px-3 py-3 align-top">
                            <div className="font-display text-sm font-extrabold text-foreground">
                              {s.student_name}
                            </div>
                            <div className="text-[0.7rem] text-muted-foreground">
                              ID {s.student_id}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {COMPLETION_PHASES.map((p) => {
                                const meta = PHASE_META[p];
                                const active = state[p];
                                const Icon = meta.icon;
                                return (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() =>
                                      effectiveSchoolCode &&
                                      togglePhase(
                                        effectiveSchoolCode,
                                        s.student_id,
                                        s.grade,
                                        activeMission,
                                        p,
                                      )
                                    }
                                    aria-pressed={active}
                                    className={cn(
                                      "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] transition hover:-translate-y-0.5",
                                      active
                                        ? phaseButtonTone[meta.tone]
                                        : "border-foreground/15 bg-white text-muted-foreground",
                                    )}
                                    title={meta.label}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {meta.short}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-right">
                            <div className="inline-flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-foreground/5">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-explore via-decide to-success"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="tabular-nums text-xs font-bold text-foreground">
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-5 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {LEGAL_TAGLINES.outcomes}
              </p>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

const emptyState = {
  workbook: false,
  portal: false,
  quiz: false,
  reflection: false,
  project: false,
  approval: false,
} as const;

/* ─────────── Small blocks ─────────── */

function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold text-foreground">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </span>
  );
}

const kpiTone: Record<string, string> = {
  explore: "from-explore-soft to-white text-explore",
  decide: "from-decide-soft to-white text-decide",
  challenge: "from-challenge-soft to-white text-challenge",
  success: "from-success-soft to-white text-success",
};

function Kpi({
  tone,
  icon,
  label,
  value,
  hint,
}: {
  tone: keyof typeof kpiTone;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/70 bg-gradient-to-br p-5 shadow-[var(--shadow-soft)]",
        kpiTone[tone],
      )}
    >
      <div className="flex items-center justify-between text-foreground/70">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/80">{icon}</span>
      </div>
      <div className="mt-3 font-display text-3xl font-extrabold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function EmptyState({ schoolAssigned }: { schoolAssigned: boolean }) {
  return (
    <section className="rounded-[28px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center shadow-[var(--shadow-soft)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-explore-soft text-explore">
        <Users className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">
        {schoolAssigned ? "No students yet at your school" : "No school assigned"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {schoolAssigned
          ? "Ask your Namma AI admin to add students. Once they're added they'll show up here for weekly tracking."
          : "You'll see your students here once a school is assigned by the Namma AI admin."}
      </p>
      <Link
        to="/admin/students"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
      >
        Open admin · students
      </Link>
    </section>
  );
}
