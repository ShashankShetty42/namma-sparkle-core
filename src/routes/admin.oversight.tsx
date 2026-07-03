import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  Camera,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Printer,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  getSchools,
  getStudents,
  getTeachers,
  onAdminState,
} from "@/lib/namma-admin";
import {
  MISSIONS_PER_GRADE,
  onCompletionState,
  studentApprovedCount,
  studentPercent,
} from "@/lib/namma-completion";
import {
  EVIDENCE_TYPES,
  getEvidence,
  onEvidenceState,
  type EvidenceType,
} from "@/lib/namma-evidence";

export const Route = createFileRoute("/admin/oversight")({
  head: () => ({
    meta: [
      { title: "District oversight · Namma AI" },
      {
        name: "description",
        content:
          "Aggregate CT & AI implementation health across every participating school in one command centre.",
      },
    ],
  }),
  component: OversightPage,
});

type SchoolRow = {
  school_id: string;
  school_name: string;
  city?: string;
  teachers: number;
  students: number;
  avgPercent: number;
  approvedMissions: number;
  totalPossible: number;
  evidenceCount: number;
  health: "leading" | "onTrack" | "needsSupport" | "notStarted";
};

function useTick() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const offA = onAdminState(bump);
    const offC = onCompletionState(bump);
    const offE = onEvidenceState(bump);
    return () => {
      offA();
      offC();
      offE();
    };
  }, []);
  return tick;
}

function OversightPage() {
  const tick = useTick();

  const { schools, teachers, students, evidence, rows } = React.useMemo(() => {
    const schools = getSchools();
    const teachers = getTeachers();
    const students = getStudents();
    const evidence = getEvidence();

    const rows: SchoolRow[] = schools.map((s) => {
      const list = students.filter((st) => st.school_id === s.school_id);
      const t = teachers.filter((tt) => tt.school_id === s.school_id);
      let sumPct = 0;
      let approved = 0;
      for (const st of list) {
        sumPct += studentPercent(s.school_id, st.student_id, st.grade);
        approved += studentApprovedCount(s.school_id, st.student_id, st.grade);
      }
      const avgPercent = list.length ? Math.round(sumPct / list.length) : 0;
      const ev = evidence.filter((e) => e.school_id === s.school_id).length;
      const health: SchoolRow["health"] =
        list.length === 0
          ? "notStarted"
          : avgPercent >= 70
            ? "leading"
            : avgPercent >= 40
              ? "onTrack"
              : "needsSupport";
      return {
        school_id: s.school_id,
        school_name: s.school_name,
        city: s.city,
        teachers: t.length,
        students: list.length,
        avgPercent,
        approvedMissions: approved,
        totalPossible: list.length * MISSIONS_PER_GRADE,
        evidenceCount: ev,
        health,
      };
    });

    return { schools, teachers, students, evidence, rows };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const districtAvg = rows.length
    ? Math.round(
        rows.reduce((acc, r) => acc + r.avgPercent * r.students, 0) /
          Math.max(1, rows.reduce((acc, r) => acc + r.students, 0)),
      )
    : 0;

  const evidenceByType = React.useMemo(() => {
    const map: Record<EvidenceType, number> = {
      photo: 0,
      worksheet: 0,
      quote: 0,
      artefact: 0,
      link: 0,
    };
    for (const e of evidence) map[e.type]++;
    return map;
  }, [evidence]);

  const healthBreakdown = React.useMemo(() => {
    const b = { leading: 0, onTrack: 0, needsSupport: 0, notStarted: 0 };
    for (const r of rows) b[r.health]++;
    return b;
  }, [rows]);

  function exportCSV() {
    const header = [
      "school_id",
      "school_name",
      "city",
      "teachers",
      "students",
      "avg_percent",
      "approved_missions",
      "total_possible",
      "evidence_items",
      "health",
    ];
    const body = rows.map((r) =>
      [
        r.school_id,
        r.school_name,
        r.city ?? "",
        r.teachers,
        r.students,
        r.avgPercent,
        r.approvedMissions,
        r.totalPossible,
        r.evidenceCount,
        r.health,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...body].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `namma-district-oversight-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <div className="shell-inner !gap-8 print:!gap-4">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-reflect-soft via-white to-challenge-soft p-6 shadow-[var(--shadow-float)] md:p-10 print:shadow-none print:border-foreground/10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-reflect/25 blur-3xl print:hidden" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-reflect/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-reflect">
                <ShieldCheck className="h-3 w-3" /> District oversight
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                Every school in{" "}
                <span className="bg-gradient-to-r from-reflect via-challenge to-story bg-clip-text text-transparent">
                  one view
                </span>
                .
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                Roll-up of completion, approvals and evidence across every participating
                school. Use it for the CBSE CT &amp; AI compliance file, board updates,
                and weekly programme reviews.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button variant="hero" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button variant="soft" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </motion.section>

        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Kpi tone="challenge" icon={Building2} label="Schools" value={schools.length} />
          <Kpi tone="explore" icon={Users} label="Teachers" value={teachers.length} />
          <Kpi tone="story" icon={GraduationCap} label="Students" value={students.length} />
          <Kpi
            tone="reflect"
            icon={TrendingUp}
            label="District avg"
            value={`${districtAvg}%`}
          />
          <Kpi tone="bonus" icon={Camera} label="Evidence" value={evidence.length} />
        </section>

        {/* Health breakdown */}
        <section className="section-panel">
          <div className="eyebrow">
            <Activity className="h-3.5 w-3.5" /> Programme health
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Where each school stands
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <HealthPill
              tone="story"
              label="Leading"
              value={healthBreakdown.leading}
              hint="≥ 70% avg completion"
            />
            <HealthPill
              tone="explore"
              label="On track"
              value={healthBreakdown.onTrack}
              hint="40 – 69%"
            />
            <HealthPill
              tone="challenge"
              label="Needs support"
              value={healthBreakdown.needsSupport}
              hint="Below 40%"
            />
            <HealthPill
              tone="bonus"
              label="Not started"
              value={healthBreakdown.notStarted}
              hint="No students yet"
            />
          </div>
        </section>

        {/* Schools table */}
        <section className="section-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">
                <Layers className="h-3.5 w-3.5" /> Schools roll-up
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                Per-school implementation status
              </h2>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-3 font-display text-lg font-bold text-foreground">
                No schools onboarded yet
              </div>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Add your first school to see the district-wide oversight populate.
              </p>
              <Button asChild variant="hero" size="sm" className="mt-4">
                <Link to="/admin/schools">Add school</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-foreground/5 bg-white/90">
              <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_1.2fr_0.9fr_0.9fr_auto] gap-3 border-b border-foreground/5 bg-foreground/[0.02] px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <div>School</div>
                <div>Teachers</div>
                <div>Students</div>
                <div>Avg completion</div>
                <div>Approved</div>
                <div>Evidence</div>
                <div className="print:hidden" />
              </div>
              {rows.map((r) => (
                <div
                  key={r.school_id}
                  className="grid grid-cols-[1.6fr_0.7fr_0.7fr_1.2fr_0.9fr_0.9fr_auto] items-center gap-3 border-b border-foreground/5 px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-extrabold text-foreground">
                      {r.school_name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      <span>{r.school_id}</span>
                      {r.city ? <span>· {r.city}</span> : null}
                      <HealthChip health={r.health} />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{r.teachers}</div>
                  <div className="text-sm font-semibold text-foreground">{r.students}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-reflect via-explore to-story"
                          style={{ width: `${r.avgPercent}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-bold text-foreground">
                        {r.avgPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    <span className="font-semibold">{r.approvedMissions}</span>
                    <span className="text-muted-foreground"> / {r.totalPossible}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {r.evidenceCount}
                  </div>
                  <div className="flex justify-end print:hidden">
                    <Button asChild size="sm" variant="soft">
                      <Link
                        to="/admin/schools/$schoolId"
                        params={{ schoolId: r.school_id }}
                      >
                        Open
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Evidence mix */}
        <section className="section-panel">
          <div className="eyebrow">
            <FileText className="h-3.5 w-3.5" /> Evidence mix
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Portfolio composition across the district
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {EVIDENCE_TYPES.map((t) => (
              <div
                key={t}
                className="rounded-[20px] border border-foreground/5 bg-white/90 p-4 shadow-[var(--shadow-soft)]"
              >
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {t}
                </div>
                <div className="mt-2 font-reward text-2xl leading-none text-foreground">
                  {evidenceByType[t]}
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-challenge via-story to-reflect"
                    style={{
                      width: `${
                        evidence.length
                          ? Math.round((evidenceByType[t] / evidence.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[0.7rem] leading-relaxed text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3 text-reflect" />
            Namma AI is an implementation partner for the CBSE CT &amp; AI curriculum. All
            aggregations here are derived from local school activity captured through the
            portal.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({
  tone,
  icon: Icon,
  label,
  value,
}: {
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-soft)]">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl",
          `bg-${tone}-soft text-${tone}`,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 font-reward text-2xl leading-none text-foreground">{value}</div>
      <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function HealthPill({
  tone,
  label,
  value,
  hint,
}: {
  tone: string;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/70 p-4 shadow-[var(--shadow-soft)]",
        `bg-${tone}-soft/60`,
      )}
    >
      <div className={cn("text-[0.62rem] font-bold uppercase tracking-[0.18em]", `text-${tone}`)}>
        {label}
      </div>
      <div className="mt-2 font-reward text-3xl leading-none text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function HealthChip({ health }: { health: SchoolRow["health"] }) {
  const map: Record<SchoolRow["health"], { tone: string; label: string }> = {
    leading: { tone: "story", label: "Leading" },
    onTrack: { tone: "explore", label: "On track" },
    needsSupport: { tone: "challenge", label: "Needs support" },
    notStarted: { tone: "bonus", label: "Not started" },
  };
  const m = map[health];
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.18em]",
        `bg-${m.tone}-soft text-${m.tone}`,
      )}
    >
      {m.label}
    </span>
  );
}
