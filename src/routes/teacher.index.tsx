import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  Library,
  NotebookPen,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";
import { GRADES, type GradeNumber } from "@/lib/namma-curriculum";
import { getAuth, onNammaState } from "@/lib/namma-progress";
import {
  getSchool,
  getStudents,
  getTeachers,
  onAdminState,
  type Student,
  type Teacher,
} from "@/lib/namma-admin";

export const Route = createFileRoute("/teacher/")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard · Namma AI" },
      {
        name: "description",
        content:
          "Plan CT & AI weeks, track workbook completion, manage projects and capture classroom evidence for Grades 3–8.",
      },
      { property: "og:title", content: "Teacher Dashboard · Namma AI" },
      {
        property: "og:description",
        content:
          "Weekly plans, student completion, workbook check-ins and project evidence — all in one teacher workspace.",
      },
    ],
  }),
  component: TeacherDashboard,
});

/* ─────────── Component ─────────── */

function TeacherDashboard() {
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
    const offA = onAdminState(refresh);
    const offN = onNammaState(refresh);
    return () => {
      offA();
      offN();
    };
  }, []);

  /* Resolve teacher record + assigned school. */
  const teacher: Teacher | null = React.useMemo(() => {
    if (!email) return null;
    return (
      getTeachers().find(
        (t) => t.teacher_email.toLowerCase() === email.toLowerCase(),
      ) ?? null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, tick]);

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

  /* Group students by grade for the class list. */
  const byGrade = React.useMemo(() => {
    const map = new Map<string, Student[]>();
    for (const s of students) {
      const arr = map.get(s.grade) ?? [];
      arr.push(s);
      map.set(s.grade, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [students]);

  const totalClasses = byGrade.length;
  const totalStudents = students.length;

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-decide-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-decide/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-explore/25 bg-white/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-explore">
                <Sparkles className="h-3.5 w-3.5" /> Teacher · Weekly Implementation
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                {teacher ? `Hi, ${teacher.teacher_name.split(" ")[0]}.` : "Your teacher workspace."}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Plan this week&apos;s CT &amp; AI sessions, track workbook and project completion,
                and capture classroom evidence — everything you need in one workspace.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <MetaChip icon={<GraduationCap className="h-3.5 w-3.5" />}>
                  {school ? school.school_name : "No school assigned"}
                </MetaChip>
                <MetaChip icon={<Users className="h-3.5 w-3.5" />}>
                  {totalClasses} classes · {totalStudents} students
                </MetaChip>
                <MetaChip icon={<CalendarClock className="h-3.5 w-3.5" />}>
                  Week of {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </MetaChip>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <PrimaryAction to="/teacher/planner" icon={<CalendarClock className="h-4 w-4" />}>
                Open weekly planner
              </PrimaryAction>
              <SecondaryAction to="/teacher/completion" icon={<ClipboardList className="h-4 w-4" />}>
                Student completion
              </SecondaryAction>
            </div>
          </div>
        </motion.section>

        {/* KPI grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            tone="explore"
            icon={<Users className="h-5 w-5" />}
            label="Students in my classes"
            value={totalStudents}
            hint={`${totalClasses} grade groups`}
          />
          <KpiCard
            tone="decide"
            icon={<BookOpenCheck className="h-5 w-5" />}
            label="Workbook completion"
            value="0%"
            hint="Update from Workbook Tracker"
          />
          <KpiCard
            tone="challenge"
            icon={<FolderKanban className="h-5 w-5" />}
            label="Active projects"
            value={0}
            hint="Start a project journal"
          />
          <KpiCard
            tone="success"
            icon={<FileSpreadsheet className="h-5 w-5" />}
            label="Evidence captured"
            value={0}
            hint="Photos, worksheets, quotes"
          />
        </section>

        {/* This week + quick actions */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-foreground/10 bg-white/85 p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-decide">
                  This week
                </p>
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Your weekly implementation checklist
                </h2>
              </div>
              <Link
                to="/teacher/planner"
                className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-decide-soft"
              >
                Open planner <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="mt-5 space-y-2">
              <ChecklistRow
                icon={<CalendarClock className="h-4 w-4" />}
                title="Publish this week's plan"
                desc="Pick focus area, activity, workbook pages and expected outcome."
                to="/teacher/planner"
              />
              <ChecklistRow
                icon={<BookOpenCheck className="h-4 w-4" />}
                title="Mark workbook completion"
                desc="Tick pages completed by each student — feeds into principal view."
                to="/teacher/workbook"
              />
              <ChecklistRow
                icon={<NotebookPen className="h-4 w-4" />}
                title="Log observations"
                desc="Short journal notes on how students engaged this week."
                to="/teacher/journal"
              />
              <ChecklistRow
                icon={<FolderKanban className="h-4 w-4" />}
                title="Update project journal"
                desc="Upload photos, artefacts and student reflections."
                to="/teacher/projects"
              />
              <ChecklistRow
                icon={<ClipboardCheck className="h-4 w-4" />}
                title="Run a check-in assessment"
                desc="Quick formative check tied to the week's learning outcome."
                to="/teacher/assessments"
              />
            </ul>
          </div>

          <div className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-bonus-soft via-white to-explore-soft p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
              Curriculum context
            </p>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              What to focus on
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Grades 3–5 focus on Computational Thinking. Grades 6–8 add AI literacy, ethics and
              projects.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {GRADES.map((g) => (
                <span
                  key={g.grade}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em]",
                    g.track === "CT"
                      ? "border-explore/25 bg-explore-soft text-explore"
                      : "border-bonus/25 bg-bonus-soft text-bonus",
                  )}
                >
                  G{g.grade} · {g.track}
                </span>
              ))}
            </div>
            <Link
              to="/teacher/resources"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
            >
              <Library className="h-4 w-4" /> Open resources
            </Link>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {LEGAL_TAGLINES.outcomes}
            </p>
          </div>
        </section>

        {/* My classes */}
        <section className="rounded-[28px] border border-foreground/10 bg-white/85 p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-explore">
                My classes
              </p>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Grades I teach at {school?.school_name ?? "this school"}
              </h2>
            </div>
            <Link
              to="/teacher/classes"
              className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-explore-soft"
            >
              Manage classes <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {byGrade.length === 0 ? (
            <EmptyRow
              text="No classes assigned yet — ask your Namma AI admin to add students at your school."
              cta="Open student directory"
              to="/teacher/classes"
            />
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {byGrade.map(([grade, list]) => {
                const n = parseInt(grade.replace(/\D/g, ""), 10) as GradeNumber;
                const track =
                  GRADES.find((g) => g.grade === n)?.track ??
                  (n >= 6 ? "CT+AI" : "CT");
                return (
                  <div
                    key={grade}
                    className="rounded-2xl border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-display text-lg font-extrabold text-foreground">
                        {grade}
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
                          track === "CT"
                            ? "bg-explore-soft text-explore"
                            : "bg-bonus-soft text-bonus",
                        )}
                      >
                        {track}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {list.length} students
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {list.slice(0, 5).map((s) => (
                        <span
                          key={s.student_id}
                          className="rounded-full bg-foreground/5 px-2 py-0.5 text-[0.65rem] font-semibold text-foreground"
                        >
                          {s.student_name.split(" ")[0]}
                        </span>
                      ))}
                      {list.length > 5 && (
                        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
                          +{list.length - 5}
                        </span>
                      )}
                    </div>
                    <Link
                      to="/teacher/completion"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
                    >
                      Track completion <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Reports */}
        <section className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-xp-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-xp">
                Reports
              </p>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Share progress with your principal
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Weekly and term reports pull directly from your planner, workbook and journal
                entries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/teacher/reports"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
              >
                <Target className="h-4 w-4" /> Open reports
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* ─────────── Small building blocks ─────────── */

function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white/80 px-2.5 py-1 text-[0.7rem] font-semibold text-foreground">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </span>
  );
}

function PrimaryAction({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
    >
      {icon}
      {children}
    </Link>
  );
}
function SecondaryAction({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white"
    >
      {icon}
      {children}
    </Link>
  );
}

const kpiTone: Record<string, string> = {
  explore: "from-explore-soft to-white text-explore",
  decide: "from-decide-soft to-white text-decide",
  challenge: "from-challenge-soft to-white text-challenge",
  success: "from-success-soft to-white text-success",
};

function KpiCard({
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
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
    </motion.div>
  );
}

function ChecklistRow({
  icon,
  title,
  desc,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  to: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-start gap-3 rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
      >
        <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-decide-soft text-decide">
          {icon}
        </span>
        <div className="flex-1">
          <div className="text-sm font-bold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
      </Link>
    </li>
  );
}

function EmptyRow({ text, cta, to }: { text: string; cta: string; to: string }) {
  return (
    <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-foreground/15 bg-white/70 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{text}</span>
      <Link
        to={to}
        className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
      >
        {cta} <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
