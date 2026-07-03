import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpenCheck,
  Building2,
  Download,
  FileBarChart,
  FileSpreadsheet,
  GraduationCap,
  Printer,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEGAL_TAGLINES, LEGAL_DISCLAIMER } from "@/lib/namma-legal";
import { GRADES, type CurriculumTrack } from "@/lib/namma-curriculum";
import { getAuth, onNammaState } from "@/lib/namma-progress";
import {
  getSchool,
  getStudents,
  getTeachers,
  onAdminState,
} from "@/lib/namma-admin";
import {
  COMPLETION_PHASES,
  MISSIONS_PER_GRADE,
  getCompletion,
  onCompletionState,
  studentApprovedCount,
  studentPercent,
} from "@/lib/namma-completion";
import {
  EVIDENCE_TYPES,
  listEvidence,
  onEvidenceState,
  type EvidenceType,
} from "@/lib/namma-evidence";

export const Route = createFileRoute("/principal/reports")({
  head: () => ({
    meta: [
      { title: "Implementation Reports · Namma AI" },
      {
        name: "description",
        content:
          "Downloadable term reports on CBSE CT & AI implementation across Grades 3–8 — completion, evidence, and per-grade breakdown.",
      },
      { property: "og:title", content: "Implementation Reports · Namma AI" },
      {
        property: "og:description",
        content:
          "Auditable, print-ready implementation reports for principals and school leadership.",
      },
    ],
  }),
  component: ReportsPage,
});

/* ─────────── Component ─────────── */

type GradeRow = {
  grade: string;
  gradeNum: number;
  track: CurriculumTrack;
  students: number;
  avgPercent: number;
  approvedMissions: number;
  totalPossible: number;
  evidenceCount: number;
};

function ReportsPage() {
  const [schoolCode, setSchoolCode] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => {
      setSchoolCode(getAuth().schoolCode);
      setTick((t) => t + 1);
    };
    refresh();
    const offs = [
      onAdminState(refresh),
      onNammaState(refresh),
      onCompletionState(refresh),
      onEvidenceState(refresh),
    ];
    return () => offs.forEach((o) => o());
  }, []);

  const school = React.useMemo(
    () => (schoolCode ? getSchool(schoolCode) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  const students = React.useMemo(
    () => (schoolCode ? getStudents(schoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );
  const teachers = React.useMemo(
    () => (schoolCode ? getTeachers(schoolCode) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );
  const evidence = React.useMemo(
    () => (schoolCode ? listEvidence({ school_id: schoolCode }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schoolCode, tick],
  );

  /* Per-grade aggregation. */
  const rows: GradeRow[] = React.useMemo(() => {
    if (!schoolCode) return [];
    const byGrade = new Map<string, typeof students>();
    for (const s of students) {
      const list = byGrade.get(s.grade) ?? [];
      list.push(s);
      byGrade.set(s.grade, list);
    }
    const out: GradeRow[] = [];
    for (const [grade, list] of byGrade.entries()) {
      const gradeNum = parseInt(grade.replace(/\D/g, ""), 10);
      const track: CurriculumTrack =
        GRADES.find((g) => g.grade === (gradeNum as (typeof GRADES)[number]["grade"]))?.track ??
        (gradeNum >= 6 ? "CT+AI" : "CT");
      let sumPct = 0;
      let approved = 0;
      for (const s of list) {
        sumPct += studentPercent(schoolCode, s.student_id, s.grade);
        approved += studentApprovedCount(schoolCode, s.student_id, s.grade);
      }
      out.push({
        grade,
        gradeNum,
        track,
        students: list.length,
        avgPercent: list.length ? Math.round(sumPct / list.length) : 0,
        approvedMissions: approved,
        totalPossible: list.length * MISSIONS_PER_GRADE,
        evidenceCount: evidence.filter((e) => e.grade === grade).length,
      });
    }
    return out.sort((a, b) => a.gradeNum - b.gradeNum);
  }, [schoolCode, students, evidence, tick]);

  /* School-wide totals. */
  const totals = React.useMemo(() => {
    const totalStudents = students.length;
    const avg =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((s, r) => s + r.avgPercent * r.students, 0) / (totalStudents || 1));
    const approved = rows.reduce((s, r) => s + r.approvedMissions, 0);
    const totalPossible = rows.reduce((s, r) => s + r.totalPossible, 0);
    return {
      students: totalStudents,
      teachers: teachers.length,
      grades: rows.length,
      avg,
      approved,
      totalPossible,
      evidence: evidence.length,
    };
  }, [rows, students, teachers, evidence]);

  const evidenceByType = React.useMemo(() => {
    const base: Record<EvidenceType, number> = {
      photo: 0,
      worksheet: 0,
      quote: 0,
      artefact: 0,
      link: 0,
    };
    for (const e of evidence) base[e.type]++;
    return base;
  }, [evidence]);

  const [range, setRange] = React.useState<"term" | "month" | "week">("term");

  const generatedAt = new Date();

  /* ─── Exports ─── */

  const exportCSV = () => {
    if (rows.length === 0) {
      toast("Nothing to export yet.");
      return;
    }
    const header = [
      "grade",
      "track",
      "students",
      "avg_percent",
      "approved_missions",
      "possible_missions",
      "evidence_items",
    ];
    const csvRows = rows.map((r) =>
      [r.grade, r.track, r.students, r.avgPercent, r.approvedMissions, r.totalPossible, r.evidenceCount]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `namma-report-${school?.school_id ?? "school"}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported as CSV");
  };

  const printReport = () => window.print();

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-xp-soft via-white to-bonus-soft p-8 shadow-[var(--shadow-float)] md:p-10 print:rounded-none print:border-0 print:bg-white print:p-6 print:shadow-none"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/50 blur-3xl print:hidden" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-xp/25 bg-white/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-xp">
                <Sparkles className="h-3.5 w-3.5" /> Principal · Implementation Reports
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                {school ? `${school.school_name} — Implementation Report` : "Implementation Report"}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                A shareable, print-ready snapshot of CT &amp; AI implementation — pulled live from
                completion tracking and evidence portfolio.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <MetaChip icon={<Building2 className="h-3.5 w-3.5" />}>
                  {school?.school_id ?? "No school code"}
                </MetaChip>
                <MetaChip icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                  Generated {generatedAt.toLocaleDateString()} · {generatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </MetaChip>
                <MetaChip icon={<Target className="h-3.5 w-3.5" />}>
                  {LEGAL_TAGLINES.short}
                </MetaChip>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end print:hidden">
              <div className="inline-flex overflow-hidden rounded-full border border-foreground/15 bg-white text-xs font-bold">
                {(["week", "month", "term"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={cn(
                      "px-3 py-2 uppercase tracking-[0.16em]",
                      range === r ? "bg-foreground text-white" : "text-foreground hover:bg-foreground/5",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <Button type="button" variant="soft" className="rounded-full" onClick={exportCSV}>
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button type="button" variant="hero" className="rounded-full" onClick={printReport}>
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </div>
          </div>
        </motion.section>

        {/* KPI grid */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi
            tone="explore"
            icon={<Users className="h-4 w-4" />}
            label="Students"
            value={totals.students}
            hint={`${totals.grades} grade groups`}
          />
          <Kpi
            tone="decide"
            icon={<GraduationCap className="h-4 w-4" />}
            label="Teachers"
            value={totals.teachers}
            hint="Class ownership"
          />
          <Kpi
            tone="challenge"
            icon={<BookOpenCheck className="h-4 w-4" />}
            label="Avg completion"
            value={`${totals.avg}%`}
            hint="Weighted across grades"
          />
          <Kpi
            tone="success"
            icon={<FileSpreadsheet className="h-4 w-4" />}
            label="Evidence items"
            value={totals.evidence}
            hint={`${totals.approved} approved missions`}
          />
        </section>

        {/* Grade-by-grade */}
        <section className="rounded-[28px] border border-foreground/10 bg-white/90 p-6 shadow-[var(--shadow-soft)] print:rounded-none print:border print:shadow-none">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-explore">
                Grade breakdown
              </p>
              <h2 className="font-display text-xl font-extrabold text-foreground">
                Per-grade implementation status
              </h2>
            </div>
            <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Range · {range}
            </span>
          </div>

          {rows.length === 0 ? (
            <EmptyBlock
              label="No grade data yet"
              hint="Add students and start marking completion in the tracker to populate this report."
              ctaTo="/principal/students"
              ctaLabel="Add students"
            />
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-3 py-2 text-left">Grade</th>
                    <th className="px-3 py-2 text-left">Track</th>
                    <th className="px-3 py-2 text-right">Students</th>
                    <th className="px-3 py-2 text-left">Avg. completion</th>
                    <th className="px-3 py-2 text-right">Approved</th>
                    <th className="px-3 py-2 text-right">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.grade} className="border-t border-foreground/5">
                      <td className="px-3 py-3 font-display text-sm font-extrabold text-foreground">
                        {r.grade}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
                            r.track === "CT"
                              ? "bg-explore-soft text-explore"
                              : "bg-bonus-soft text-bonus",
                          )}
                        >
                          {r.track}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.students}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-foreground/5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-explore via-decide to-success"
                              style={{ width: `${r.avgPercent}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-xs font-bold text-foreground">
                            {r.avgPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {r.approvedMissions}
                        <span className="text-muted-foreground">/{r.totalPossible}</span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.evidenceCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Evidence + phase breakdown */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-foreground/10 bg-gradient-to-br from-success-soft via-white to-explore-soft p-6 shadow-[var(--shadow-soft)] print:rounded-none print:border print:shadow-none">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-success">
              Evidence collected
            </p>
            <h2 className="font-display text-xl font-extrabold text-foreground">By artefact type</h2>
            <div className="mt-5 space-y-3">
              {EVIDENCE_TYPES.map((t) => {
                const count = evidenceByType[t];
                const max = Math.max(1, ...EVIDENCE_TYPES.map((x) => evidenceByType[x]));
                return (
                  <div key={t} className="grid grid-cols-[90px_1fr_40px] items-center gap-3">
                    <span className="text-xs font-bold capitalize text-foreground">{t}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{ width: `${Math.round((count / max) * 100)}%` }}
                      />
                    </div>
                    <span className="text-right text-xs font-bold tabular-nums text-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link
              to="/principal/evidence"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-foreground hover:underline"
            >
              Open evidence portfolio →
            </Link>
          </div>

          <div className="rounded-[28px] border border-foreground/10 bg-white/90 p-6 shadow-[var(--shadow-soft)] print:rounded-none print:border print:shadow-none">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-decide">
              Completion phases
            </p>
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Phase-level completion
            </h2>
            <PhaseBreakdown schoolCode={schoolCode} rows={rows} />
            <Link
              to="/teacher/completion"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-foreground hover:underline"
            >
              Open completion tracker →
            </Link>
          </div>
        </section>

        {/* Legal footer / attestation */}
        <section className="rounded-[24px] border border-foreground/10 bg-white/70 p-5 text-xs text-muted-foreground shadow-[var(--shadow-soft)] print:rounded-none print:border print:shadow-none">
          <div className="flex items-start gap-3">
            <FileBarChart className="h-4 w-4 shrink-0 text-foreground/60" />
            <div>
              <p className="font-semibold text-foreground">Reporting notes</p>
              <p className="mt-1 leading-relaxed">
                {LEGAL_DISCLAIMER} All figures are compiled from the school's own inputs into the
                platform. Values marked "0" indicate that the corresponding activity has not yet
                been recorded, not that it did not occur.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

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
        "rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-[var(--shadow-soft)] print:rounded-none print:border print:shadow-none",
        kpiTone[tone],
      )}
    >
      <div className="flex items-center justify-between text-foreground/70">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/80">{icon}</span>
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-[0.7rem] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function EmptyBlock({
  label,
  hint,
  ctaTo,
  ctaLabel,
}: {
  label: string;
  hint: string;
  ctaTo: string;
  ctaLabel: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-foreground/15 bg-white/70 p-6 text-sm text-muted-foreground">
      <div className="font-semibold text-foreground">{label}</div>
      <p className="mt-1">{hint}</p>
      <Link
        to={ctaTo}
        className="mt-3 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function PhaseBreakdown({
  schoolCode,
  rows,
}: {
  schoolCode: string | null;
  rows: GradeRow[];
}) {
  const totals = React.useMemo(() => {
    const base = Object.fromEntries(COMPLETION_PHASES.map((p) => [p, 0])) as Record<
      (typeof COMPLETION_PHASES)[number],
      number
    >;
    if (!schoolCode) return { base, possible: 0 };
    let possible = 0;
    for (const row of rows) {
      const list = getStudents(schoolCode).filter((s) => s.grade === row.grade);
      for (const s of list) {
        for (let m = 1; m <= MISSIONS_PER_GRADE; m++) {
          const state = getCompletion(schoolCode, s.student_id, s.grade, m);
          for (const p of COMPLETION_PHASES) if (state[p]) base[p]++;
        }
      }
      possible += list.length * MISSIONS_PER_GRADE;
    }
    return { base, possible };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolCode, rows]);

  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-foreground/15 bg-white p-4 text-xs text-muted-foreground">
        No completion data recorded yet.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {COMPLETION_PHASES.map((p) => {
        const count = totals.base[p];
        const pct = totals.possible === 0 ? 0 : Math.round((count / totals.possible) * 100);
        return (
          <div key={p} className="grid grid-cols-[110px_1fr_54px] items-center gap-3">
            <span className="text-xs font-bold capitalize text-foreground">{p}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-foreground/5">
              <div
                className="h-full rounded-full bg-decide"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-xs font-bold tabular-nums text-foreground">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
