import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  FileSpreadsheet,
  FolderKanban,
  NotebookPen,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_METRICS,
  ACADEMIC_SETUP,
  BACKFILL_MONTHS,
  type BackfillStatus,
} from "@/lib/namma-academic";

export const Route = createFileRoute("/principal/backfill")({
  head: () => ({
    meta: [
      { title: "Backfill Centre · Namma AI" },
      {
        name: "description",
        content:
          "Document CT & AI implementation that happened before Namma AI onboarding. Add summaries, teacher confirmations, project evidence and generate a backfill report.",
      },
    ],
  }),
  component: BackfillCentre,
});

const QUICK_ACTIONS = [
  { label: "Mark month as completed", icon: CheckCircle2 },
  { label: "Add teacher confirmation", icon: UserCheck },
  { label: "Upload evidence", icon: Upload },
  { label: "Add summary observation", icon: NotebookPen },
  { label: "Mark workbook completion summary", icon: CheckCircle2 },
  { label: "Add project evidence", icon: FolderKanban },
  { label: "Generate backfill report", icon: FileSpreadsheet },
];

function BackfillCentre() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Backfill Centre
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Document what happened before Namma AI onboarding
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Backfill period: <strong>{ACADEMIC_SETUP.backfillPeriod}</strong>. Add month-wise
            summaries, teacher confirmations and evidence to improve annual evidence
            readiness.
          </p>
        </section>

        {/* Backfill summary */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Backfill Completion" value={`${ACADEMIC_METRICS.backfillCompletionPct}%`} />
          <Stat label="Grades Selected" value={`Grade ${ACADEMIC_SETUP.gradesCovered.join(", ")}`} />
          <Stat label="Teachers Assigned" value={`${ACADEMIC_SETUP.teachers}`} />
          <Stat label="Evidence Uploaded" value="30 items" />
        </section>

        {/* Quick actions */}
        <section className="rounded-3xl border border-border/60 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-display text-lg font-extrabold text-foreground">Quick Backfill Actions</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-2 rounded-2xl border border-border/60 bg-white px-4 py-3 text-left text-sm font-semibold text-foreground shadow-sm hover:bg-muted/30"
              >
                <a.icon className="h-4 w-4 text-muted-foreground" />
                {a.label}
              </button>
            ))}
          </div>
        </section>

        {/* Month-wise backfill table */}
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Workbook</th>
                <th className="px-4 py-3">Teacher Confirmation</th>
                <th className="px-4 py-3">Project Evidence</th>
                <th className="px-4 py-3">Observation Summary</th>
                <th className="px-4 py-3">Evidence Uploaded</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {BACKFILL_MONTHS.map((m) => (
                <tr key={m.month} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-semibold text-foreground">{m.month}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.workbook}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.teacherConfirmation}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.projectEvidence}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.observationSummary}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.evidenceUploaded}</td>
                  <td className="px-4 py-3"><StatusBadge s={m.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/40">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="flex flex-wrap gap-2">
          <Link to="/principal/gap-analysis" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            View Gap Analysis
          </Link>
          <Link to="/principal/reports" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm">
            Generate Backfill Summary Report
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
      <div className="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-extrabold text-foreground">{value}</div>
    </div>
  );
}

function StatusBadge({ s }: { s: BackfillStatus }) {
  const map: Record<BackfillStatus, string> = {
    "Not Started": "bg-slate-100 text-slate-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Summary Complete": "bg-emerald-100 text-emerald-700",
    "Detailed Complete": "bg-emerald-100 text-emerald-800",
    "Evidence Missing": "bg-amber-100 text-amber-700",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider", map[s])}>
      {s}
    </span>
  );
}
