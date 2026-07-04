import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FolderKanban, Search, Sparkles, XCircle } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { getDemoProjects, type ProjectStatus } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/projects")({
  head: () => ({
    meta: [
      { title: "Project Review Centre · Namma AI" },
      {
        name: "description",
        content:
          "School-wide project submissions, rubric scores and approval throughput across CBSE CT & AI grades.",
      },
    ],
  }),
  component: ProjectReviewCentre,
});

const STATUS_TONE: Record<ProjectStatus, string> = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-100",
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-100",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Needs Improvement": "bg-rose-50 text-rose-700 border-rose-100",
  Resubmitted: "bg-violet-50 text-violet-700 border-violet-100",
};

const STATUSES: ("All" | ProjectStatus)[] = [
  "All",
  "Pending Review",
  "Submitted",
  "Resubmitted",
  "Approved",
  "Needs Improvement",
];

function ProjectReviewCentre() {
  const projects = React.useMemo(() => getDemoProjects(), []);
  const [status, setStatus] = React.useState<(typeof STATUSES)[number]>("All");
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (q && !`${p.student} ${p.title} ${p.grade}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [projects, status, q]);

  const counts = React.useMemo(() => {
    const c: Record<ProjectStatus, number> = {
      Submitted: 0,
      "Pending Review": 0,
      Approved: 0,
      "Needs Improvement": 0,
      Resubmitted: 0,
    };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);

  const avgScore = React.useMemo(() => {
    const approved = projects.filter((p) => p.status === "Approved");
    if (!approved.length) return 0;
    return Math.round(approved.reduce((s, p) => s + p.rubricScore, 0) / approved.length);
  }, [projects]);

  const kpis = [
    { label: "Total submissions", value: projects.length, icon: FolderKanban, tone: "blue" },
    { label: "Pending review", value: counts["Pending Review"], icon: Clock, tone: "amber" },
    { label: "Approved", value: counts.Approved, icon: CheckCircle2, tone: "green" },
    { label: "Avg rubric score", value: `${avgScore}/10`, icon: Sparkles, tone: "violet" },
  ] as const;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <FolderKanban className="h-3 w-3" /> Principal · Project Review Centre
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
            Project submissions across Grades 6–8
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track student CT &amp; AI projects, teacher review status and rubric scoring in one queue.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full",
                  k.tone === "blue" && "bg-blue-50 text-blue-700",
                  k.tone === "amber" && "bg-amber-50 text-amber-700",
                  k.tone === "green" && "bg-emerald-50 text-emerald-700",
                  k.tone === "violet" && "bg-violet-50 text-violet-700",
                )}
              >
                <k.icon className="h-4 w-4" />
              </span>
              <div className="mt-3 font-display text-2xl font-extrabold tabular-nums text-foreground">
                {k.value}
              </div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search student, title, grade"
                className="w-full rounded-full border border-border/60 bg-muted/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-bold transition",
                    status === s
                      ? "border-foreground bg-foreground text-white"
                      : "border-border/60 text-foreground hover:bg-muted/40",
                  )}
                >
                  {s}
                  {s !== "All" && (
                    <span className="ml-1.5 text-[0.65rem] opacity-70">
                      {counts[s as ProjectStatus]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-left">Grade</th>
                  <th className="px-3 py-2 text-left">Project</th>
                  <th className="px-3 py-2 text-left">Submitted</th>
                  <th className="px-3 py-2 text-right">Score</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Teacher note</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 60).map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="px-3 py-3 font-semibold text-foreground">{p.student}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {p.grade}
                      {p.section}
                    </td>
                    <td className="px-3 py-3 text-foreground">{p.title}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.submittedOn}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-bold text-foreground">
                      {p.rubricScore}/10
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-bold",
                          STATUS_TONE[p.status],
                        )}
                      >
                        {p.status === "Approved" && <CheckCircle2 className="h-3 w-3" />}
                        {p.status === "Needs Improvement" && <XCircle className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{p.comment}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                      No projects match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 60 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Showing 60 of {filtered.length} matching projects.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
