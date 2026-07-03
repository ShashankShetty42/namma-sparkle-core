import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  BookOpenCheck,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES } from "@/lib/namma-legal";
import { GRADES } from "@/lib/namma-curriculum";
import {
  getAuth,
  onNammaState,
} from "@/lib/namma-progress";
import {
  getSchool,
  getSchoolStats,
  getStudents,
  getTeachers,
  onAdminState,
  type School,
} from "@/lib/namma-admin";

export const Route = createFileRoute("/principal/")({
  head: () => ({
    meta: [
      { title: "School Implementation Dashboard · Namma AI" },
      {
        name: "description",
        content:
          "See CT & AI implementation across your school — grades, teachers, students, workbook completion, projects and evidence readiness.",
      },
      { property: "og:title", content: "School Implementation Dashboard · Namma AI" },
      {
        property: "og:description",
        content:
          "A single view of CBSE CT & AI implementation across Grades 3–8, built for school leadership.",
      },
    ],
  }),
  component: PrincipalDashboard,
});

/* ─────────── Component ─────────── */

function PrincipalDashboard() {
  const [schoolCode, setSchoolCode] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => {
      setSchoolCode(getAuth().schoolCode);
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

  const school: School | null = React.useMemo(
    () => (schoolCode ? getSchool(schoolCode) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const stats = React.useMemo(
    () =>
      schoolCode
        ? getSchoolStats(schoolCode)
        : { totalStudents: 0, totalTeachers: 0, activitiesCompleted: 0, averageCompletion: 0, distribution: {} },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const teachers = React.useMemo(
    () => (schoolCode ? getTeachers(schoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const students = React.useMemo(
    () => (schoolCode ? getStudents(schoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  /* Track split: CT (G3–5) vs CT+AI (G6–8) */
  const trackSplit = React.useMemo(() => {
    let ct = 0;
    let ctai = 0;
    for (const s of students) {
      const n = parseInt(s.grade.replace(/\D/g, ""), 10);
      if (n >= 3 && n <= 5) ct++;
      else if (n >= 6 && n <= 8) ctai++;
    }
    return { ct, ctai, total: ct + ctai || 1 };
  }, [students]);

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-bonus-soft via-white to-challenge-soft p-8 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-bonus/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-bonus/25 bg-white/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
                <Sparkles className="h-3.5 w-3.5" /> Principal · School Implementation
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                {school ? school.school_name : "Your school"}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                A single view of CT &amp; AI implementation — grades, teachers, students, workbook
                completion, projects and evidence readiness for Grades 3–8.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <MetaChip icon={<Building2 className="h-3.5 w-3.5" />}>
                  {school?.school_id ?? "No school code"}
                </MetaChip>
                {school?.city && (
                  <MetaChip icon={<CalendarClock className="h-3.5 w-3.5" />}>
                    {school.city}{school.state ? `, ${school.state}` : ""}
                  </MetaChip>
                )}
                <MetaChip icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                  {LEGAL_TAGLINES.short}
                </MetaChip>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <PrimaryAction to="/principal/implementation" icon={<Target className="h-4 w-4" />}>
                Implementation tracker
              </PrimaryAction>
              <SecondaryAction to="/principal/reports" icon={<LineChart className="h-4 w-4" />}>
                View reports
              </SecondaryAction>
            </div>
          </div>
        </motion.section>

        {/* KPI grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            tone="explore"
            icon={<GraduationCap className="h-5 w-5" />}
            label="Students onboarded"
            value={stats.totalStudents}
            hint={`${trackSplit.ct} on CT · ${trackSplit.ctai} on CT+AI`}
          />
          <KpiCard
            tone="decide"
            icon={<Users className="h-5 w-5" />}
            label="Teachers active"
            value={stats.totalTeachers}
            hint={teachers.length ? "Class ownership assigned" : "Add teachers to begin"}
          />
          <KpiCard
            tone="challenge"
            icon={<BookOpenCheck className="h-5 w-5" />}
            label="Workbook completion"
            value={`${stats.averageCompletion}%`}
            hint="Averaged across all grades"
          />
          <KpiCard
            tone="success"
            icon={<FileSpreadsheet className="h-5 w-5" />}
            label="Evidence ready"
            value={stats.activitiesCompleted}
            hint="Artefacts collected this term"
          />
        </section>

        {/* Two-column: grade distribution + track split */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-explore">
                  Grade coverage · 3–8
                </p>
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Students per grade
                </h2>
              </div>
              <Link
                to="/principal/grades"
                className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-explore-soft"
              >
                Manage grades <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {GRADES.map((g) => {
                const count = stats.distribution[g.label] ?? 0;
                const max = Math.max(1, ...GRADES.map((x) => stats.distribution[x.label] ?? 0));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={g.grade} className="grid grid-cols-[80px_1fr_48px] items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">G{g.grade}</span>
                      <TrackPill track={g.track} />
                    </div>
                    <div className="relative h-3 rounded-full bg-foreground/5">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full",
                          g.track === "CT" ? "bg-explore" : "bg-bonus",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold tabular-nums text-foreground">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-explore-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-decide">
              Curriculum track split
            </p>
            <h2 className="font-display text-xl font-extrabold text-foreground">CT vs CT + AI</h2>
            <div className="mt-5 space-y-4">
              <TrackBar
                label="Computational Thinking (G3–5)"
                value={trackSplit.ct}
                total={trackSplit.total}
                colorClass="bg-explore"
              />
              <TrackBar
                label="CT + AI (G6–8)"
                value={trackSplit.ctai}
                total={trackSplit.total}
                colorClass="bg-bonus"
              />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Track split follows the CBSE CT &amp; AI implementation model for middle school.
            </p>
          </div>
        </section>

        {/* Implementation readiness + quick actions */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ReadinessCard
            title="Weekly planners"
            desc="Teachers publishing weekly CT/AI plans."
            complete={teachers.length > 0}
            to="/teacher/planner"
            tone="decide"
            icon={<CalendarClock className="h-5 w-5" />}
          />
          <ReadinessCard
            title="Project journals"
            desc="Student projects with evidence artefacts."
            complete={stats.activitiesCompleted > 0}
            to="/principal/projects"
            tone="explore"
            icon={<FolderKanban className="h-5 w-5" />}
          />
          <ReadinessCard
            title="Assessment records"
            desc="Formative check-ins captured this term."
            complete={false}
            to="/teacher/assessments"
            tone="challenge"
            icon={<ClipboardCheck className="h-5 w-5" />}
          />
        </section>

        {/* Teacher activity + certificates */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-decide">
                  Teacher activity
                </p>
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Recently added educators
                </h2>
              </div>
              <Link
                to="/principal/teachers"
                className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-decide-soft"
              >
                Manage teachers <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {teachers.length === 0 ? (
              <EmptyRow
                text="No teachers yet — add educators to allocate grades and start weekly plans."
                cta="Add teachers"
                to="/admin/teachers"
              />
            ) : (
              <ul className="mt-5 space-y-2">
                {teachers.slice(0, 5).map((t) => (
                  <li
                    key={t.teacher_id}
                    className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white/70 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-decide-soft text-decide">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{t.teacher_name}</div>
                        <div className="text-xs text-muted-foreground">{t.teacher_email}</div>
                      </div>
                    </div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-bonus-soft via-white to-xp-soft p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
              Certificates
            </p>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Implementation certificate
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Generate a school-level certificate once your termly implementation targets are met.
            </p>
            <Link
              to="/principal/certificates"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:opacity-95"
            >
              <Award className="h-4 w-4" /> Open certificates
            </Link>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {LEGAL_TAGLINES.outcomes}
            </p>
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
  bonus: "from-bonus-soft to-white text-bonus",
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

function TrackPill({ track }: { track: "CT" | "CT+AI" }) {
  return (
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
  );
}

function TrackBar({
  label,
  value,
  total,
  colorClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value} · {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-foreground/5">
        <div className={cn("h-full rounded-full", colorClass)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const readinessTone: Record<string, string> = {
  decide: "border-decide/20 bg-decide-soft text-decide",
  explore: "border-explore/20 bg-explore-soft text-explore",
  challenge: "border-challenge/20 bg-challenge-soft text-challenge",
};

function ReadinessCard({
  title,
  desc,
  complete,
  to,
  tone,
  icon,
}: {
  title: string;
  desc: string;
  complete: boolean;
  to: string;
  tone: keyof typeof readinessTone;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group rounded-[24px] border border-foreground/10 bg-white/85 p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
            readinessTone[tone],
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
            complete ? "bg-success-soft text-success" : "bg-foreground/5 text-muted-foreground",
          )}
        >
          {complete ? "In progress" : "Not started"}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-extrabold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:underline">
        Open <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
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
