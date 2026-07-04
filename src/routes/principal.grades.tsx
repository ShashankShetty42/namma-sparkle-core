import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { GRADE_SUMMARIES, type GradeSummary } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/grades")({
  head: () => ({ meta: [{ title: "Grade Insights · Namma AI" }] }),
  component: GradesIndex,
});

function GradesIndex() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Principal · Grade insights
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Grade-wise implementation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All six grades in a single glance. Click any grade to open its drill-down dashboard with
            section A/B comparison, teacher summary and recommended actions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {GRADE_SUMMARIES.map((g) => (
            <BigGradeCard key={g.grade} g={g} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function BigGradeCard({ g }: { g: GradeSummary }) {
  const status = g.risk === "On Track" ? "green" : g.risk === "Needs Attention" ? "amber" : "red";
  return (
    <Link
      to="/principal/grades/$grade"
      params={{ grade: String(g.grade) }}
      className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:border-foreground/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted/40">
            <GraduationCap className="h-5 w-5 text-foreground" />
          </span>
          <div>
            <h3 className="font-display text-xl font-extrabold text-foreground">{g.label}</h3>
            <p className="text-xs text-muted-foreground">
              {g.track} · Week {g.currentWeek} · {g.students} students
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
            status === "green" && "bg-emerald-50 text-emerald-700",
            status === "amber" && "bg-amber-50 text-amber-700",
            status === "red" && "bg-red-50 text-red-700",
          )}
        >
          {g.risk}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{g.focus}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="Impl." value={`${g.studentCompletion}%`} />
        <Metric label="Workbook" value={`${g.workbookTracking}%`} />
        <Metric label="Teacher" value={`${g.teacherCompletion}%`} />
      </div>
      <div className="mt-4 flex items-center justify-end text-xs font-semibold text-foreground">
        Open drill-down <ArrowRight className="ml-1 h-3 w-3" />
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 py-2">
      <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-sm font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
