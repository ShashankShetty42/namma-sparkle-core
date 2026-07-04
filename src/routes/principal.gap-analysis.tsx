import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, FileBarChart, Sparkles } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_METRICS,
  ACADEMIC_SETUP,
  GAP_ROWS,
  type GapSeverity,
} from "@/lib/namma-academic";

export const Route = createFileRoute("/principal/gap-analysis")({
  head: () => ({
    meta: [
      { title: "Implementation Gap Analysis · Namma AI" },
      {
        name: "description",
        content:
          "Grade-wise implementation gaps: missing workbook records, teacher updates, project evidence, observations and reports.",
      },
    ],
  }),
  component: GapAnalysis,
});

function GapAnalysis() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Implementation Gap Analysis
          </div>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
                Where is CT & AI implementation falling short?
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                {ACADEMIC_SETUP.schoolName} joined Namma AI in {ACADEMIC_SETUP.onboardingMonth}.
                This report identifies missing records, evidence and reports across grades so
                you can prioritise backfill and next-year readiness.
              </p>
            </div>
            <Link
              to="/principal/backfill"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              <FileBarChart className="h-4 w-4" /> Open Backfill Centre
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Gap Score" value={ACADEMIC_METRICS.gapSeverity} tone="amber" />
          <Stat label="Evidence Gap" value={`${ACADEMIC_METRICS.evidenceGapItems} items`} tone="amber" />
          <Stat label="Backfill Completion" value={`${ACADEMIC_METRICS.backfillCompletionPct}%`} tone="blue" />
          <Stat label="2027–28 Readiness" value={`${ACADEMIC_METRICS.readinessNextYearPct}%`} tone="green" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Grade / Section</th>
                <th className="px-4 py-3">Missing Workbook</th>
                <th className="px-4 py-3">Teacher Updates</th>
                <th className="px-4 py-3">Missing Projects</th>
                <th className="px-4 py-3">Missing Observations</th>
                <th className="px-4 py-3">Missing Reports</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {GAP_ROWS.map((r) => (
                <tr key={r.section} className="border-b border-border/40 last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {r.grade}
                    <div className="text-[0.65rem] font-normal text-muted-foreground">
                      Section {r.section}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.missingWorkbook}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.missingUpdates}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.missingProjects}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.missingObservations}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.missingReports.join(", ")}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge s={r.severity} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="text-xs text-muted-foreground">
          <AlertTriangle className="mr-1 inline h-3 w-3" />
          Recommended: complete July–September backfill summary to move Grade 7B and 8B out
          of high-risk gap severity.
        </p>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "green" | "amber" | "blue" }) {
  const bg =
    tone === "green" ? "bg-emerald-50 border-emerald-100" : tone === "amber" ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100";
  return (
    <div className={cn("rounded-2xl border p-4", bg)}>
      <div className="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

function SeverityBadge({ s }: { s: GapSeverity }) {
  const map: Record<GapSeverity, string> = {
    Low: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider", map[s])}>
      {s}
    </span>
  );
}
