import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  FileBarChart,
  FolderKanban,
  NotebookPen,
  Target,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  GRADE_SUMMARIES,
  getDemoTeachers,
  type GradeSummary,
} from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/grades/$grade")({
  head: ({ params }) => ({
    meta: [{ title: `Grade ${params.grade} · Drill-down · Namma AI` }],
  }),
  component: GradeDrillDown,
});

function GradeDrillDown() {
  const { grade } = Route.useParams();
  const gradeNum = parseInt(grade, 10);
  const g = GRADE_SUMMARIES.find((s) => s.grade === gradeNum);
  if (!g) throw notFound();

  const sectionA = sectionSnapshot(g, "A");
  const sectionB = sectionSnapshot(g, "B");
  const teachers = getDemoTeachers().filter((t) => t.grade === gradeNum);

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <Link
          to="/principal/grades"
          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> All grades
        </Link>

        {/* Header */}
        <header className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Grade drill-down · {g.track}
              </div>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground">{g.label}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{g.focus}</p>
            </div>
            <RiskPill risk={g.risk} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Students" value={g.students} />
            <Stat label="Current week" value={`${g.currentWeek} / 35`} />
            <Stat label="Observations" value={g.observations} />
            <Stat label="Projects" value={g.projectsCompleted} />
          </div>
        </header>

        {/* Section A/B comparison */}
        <section>
          <SectionHead title="Section comparison" subtitle="Section A vs Section B" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SectionCard s={sectionA} />
            <SectionCard s={sectionB} />
          </div>
          <InsightBanner text={buildInsight(g, sectionA, sectionB)} />
        </section>

        {/* Teachers */}
        <section>
          <SectionHead title={`Assigned teachers · ${teachers.length}`} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {teachers.map((t) => (
              <div
                key={t.teacher_email}
                className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-muted/40">
                    <Users className="h-4 w-4 text-foreground" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.teacher_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.role} · Grade {t.grade}
                      {t.section !== "*" ? t.section : ""} · {t.subject}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended actions */}
        <section>
          <SectionHead title="Recommended actions" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {buildActions(g).map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white p-4 shadow-sm transition hover:border-foreground/30 hover:bg-muted/20"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-muted/40">
                  <a.icon className="h-4 w-4 text-foreground" />
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">{a.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* ─────────── Section snapshot logic ─────────── */

type Snap = {
  section: "A" | "B";
  implementation: number;
  workbook: number;
  projects: number;
  evidence: number;
  status: "On Track" | "Needs Attention" | "Delayed";
};

function sectionSnapshot(g: GradeSummary, section: "A" | "B"): Snap {
  // Deterministic split: A leads, B trails; magnitude depends on overall risk.
  const spread = g.risk === "Delayed" ? 18 : g.risk === "Needs Attention" ? 10 : 5;
  const bias = section === "A" ? Math.round(spread / 2) : -Math.round(spread / 2);
  const impl = clamp(g.studentCompletion + bias);
  const wb = clamp(g.workbookTracking + bias);
  const pj = clamp((g.projectCompletion ?? Math.round(g.studentCompletion * 0.7)) + bias);
  const ev = clamp(70 + bias);
  const status: Snap["status"] =
    impl >= 70 ? "On Track" : impl >= 55 ? "Needs Attention" : "Delayed";
  return { section, implementation: impl, workbook: wb, projects: pj, evidence: ev, status };
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function buildInsight(g: GradeSummary, a: Snap, b: Snap): string {
  const [ahead, behind] = a.implementation >= b.implementation ? [a, b] : [b, a];
  if (Math.abs(a.implementation - b.implementation) < 4) {
    return `Both sections of ${g.label} are performing similarly (~${a.implementation}%). Focus on lifting overall workbook check-ins and project completion together.`;
  }
  return `Section ${behind.section} is trailing Section ${ahead.section} by ${
    ahead.implementation - behind.implementation
  }% — the gap is mainly in ${behind.projects < behind.workbook ? "project evidence" : "workbook check-ins"}.`;
}

function buildActions(g: GradeSummary) {
  return [
    { label: `Review ${g.label} project backlog`, to: "/teacher/projects", icon: FolderKanban },
    { label: `Ask teacher to update Week ${g.currentWeek} records`, to: "/principal/teachers", icon: Users },
    { label: `Add observations for students with no notes`, to: "/teacher/journal", icon: NotebookPen },
    { label: `Generate ${g.label} progress report`, to: "/principal/reports", icon: FileBarChart },
    { label: `Identify students delayed for 2+ weeks`, to: "/principal/students", icon: Target },
  ];
}

/* ─────────── Small components ─────────── */

function SectionCard({ s }: { s: Snap }) {
  const tone =
    s.status === "On Track" ? "green" : s.status === "Needs Attention" ? "amber" : "red";
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-lg font-extrabold text-foreground">Section {s.section}</h4>
        <RiskPill risk={s.status} />
      </div>
      <div className="mt-4 space-y-2.5">
        <Bar label="Implementation" value={s.implementation} />
        <Bar label="Workbook" value={s.workbook} />
        <Bar label="Projects" value={s.projects} />
        <Bar label="Evidence" value={s.evidence} />
      </div>
      <div className="mt-4 border-t border-border/40 pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Status · <span className={cn(tone === "green" && "text-emerald-600", tone === "amber" && "text-amber-600", tone === "red" && "text-red-600")}>{s.status}</span>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="font-bold tabular-nums text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-muted/60">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 75 ? "bg-emerald-500" : value >= 60 ? "bg-blue-500" : value >= 45 ? "bg-amber-500" : "bg-red-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-extrabold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

function RiskPill({ risk }: { risk: string }) {
  const tone =
    risk === "On Track"
      ? "bg-emerald-50 text-emerald-700"
      : risk === "Needs Attention"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";
  return (
    <span className={cn("rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider", tone)}>
      {risk}
    </span>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-display text-lg font-extrabold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function InsightBanner({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 text-sm text-foreground">
      <span className="font-bold">Insight · </span>
      {text}
    </div>
  );
}
