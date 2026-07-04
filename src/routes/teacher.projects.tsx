import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Search } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import {
  getDemoProjects,
  type ProjectRow,
  type ProjectStatus,
} from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/projects")({
  head: () => ({ meta: [{ title: "Project Review · Namma AI" }] }),
  component: ProjectsReview,
});

const STATUS_TONE: Record<ProjectStatus, string> = {
  "Submitted": "bg-explore-soft text-explore",
  "Pending Review": "bg-challenge-soft text-challenge",
  "Approved": "bg-success-soft text-success",
  "Needs Improvement": "bg-bonus-soft text-bonus",
  "Resubmitted": "bg-decide-soft text-decide",
};

function ProjectsReview() {
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [q, setQ] = React.useState("");
  const all = React.useMemo(() => getDemoProjects(), []);

  const filtered = all.filter((p) => {
    if (gradeFilter !== "all" && p.grade !== gradeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (q && !p.student.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const summary = React.useMemo(() => {
    const s: Record<ProjectStatus, number> = {
      "Submitted": 0, "Pending Review": 0, "Approved": 0,
      "Needs Improvement": 0, "Resubmitted": 0,
    };
    all.forEach((p) => s[p.status]++);
    return s;
  }, [all]);

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-bonus">
            <FolderKanban className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Project Review</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {all.length} project submissions · Grades 6–8
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rubric scoring, comments and revisions across the CT & AI implementation.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-5">
            {(Object.keys(summary) as ProjectStatus[]).map((s) => (
              <div key={s} className={`rounded-2xl px-3 py-2 ${STATUS_TONE[s]}`}>
                <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">{s}</div>
                <div className="mt-0.5 font-display text-2xl font-extrabold">{summary[s]}</div>
              </div>
            ))}
          </div>
        </header>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search student…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-full border border-foreground/10 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-decide/40"
              />
            </div>
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All grades</option>
              <option>Grade 6</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              {(Object.keys(STATUS_TONE) as ProjectStatus[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Grade</th>
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Submitted</th>
                  <th className="pb-2">Rubric</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Teacher comment</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: ProjectRow) => (
                  <tr key={p.id} className="border-b border-foreground/5">
                    <td className="py-2.5 font-semibold text-foreground">{p.student}</td>
                    <td className="py-2.5 text-muted-foreground">{p.grade}{p.section}</td>
                    <td className="py-2.5 text-foreground">{p.title}</td>
                    <td className="py-2.5 tabular-nums text-muted-foreground">{p.submittedOn}</td>
                    <td className="py-2.5 tabular-nums font-bold text-foreground">{p.rubricScore}/10</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${STATUS_TONE[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 max-w-[260px] truncate text-muted-foreground">{p.comment}</td>
                    <td className="py-2.5 text-right">
                      <button className="rounded-full border border-foreground/15 bg-white px-3 py-1 text-xs font-semibold text-foreground hover:bg-foreground/5">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-sm text-muted-foreground">No projects match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
