import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Search, Users } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { getDemoCompletionRows } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/students")({
  head: () => ({
    meta: [
      { title: "Students · Namma AI" },
      {
        name: "description",
        content: "School-wide student roster showing CT & AI implementation status per learner.",
      },
    ],
  }),
  component: StudentsRoster,
});

function StudentsRoster() {
  const rows = React.useMemo(() => getDemoCompletionRows(), []);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"All" | "Completed" | "In Progress" | "Needs Attention">("All");

  const filtered = rows.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (q && !r.student.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const kpis = [
    { label: "Students shown", value: rows.length, tone: "blue" as const },
    { label: "Completed term", value: rows.filter((r) => r.status === "Completed").length, tone: "green" as const },
    { label: "In progress", value: rows.filter((r) => r.status === "In Progress").length, tone: "amber" as const },
    { label: "Needs attention", value: rows.filter((r) => r.status === "Needs Attention").length, tone: "rose" as const },
  ];

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Users className="h-3 w-3" /> Principal · Students · Grade 6A
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
            Student directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live CT &amp; AI implementation status for every learner. Drill into other grades from
            the Grades page.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full",
                  k.tone === "blue" && "bg-blue-50 text-blue-700",
                  k.tone === "green" && "bg-emerald-50 text-emerald-700",
                  k.tone === "amber" && "bg-amber-50 text-amber-700",
                  k.tone === "rose" && "bg-rose-50 text-rose-700",
                )}
              >
                <GraduationCap className="h-4 w-4" />
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
                placeholder="Search student"
                className="w-full rounded-full border border-border/60 bg-muted/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Completed", "In Progress", "Needs Attention"] as const).map((s) => (
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
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-left">Workbook</th>
                  <th className="px-3 py-2 text-left">Portal</th>
                  <th className="px-3 py-2 text-left">Quiz</th>
                  <th className="px-3 py-2 text-left">Project</th>
                  <th className="px-3 py-2 text-left">Last activity</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.student} className="border-t border-border/60">
                    <td className="px-3 py-3 font-semibold text-foreground">{r.student}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.workbook}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.portal}</td>
                    <td className="px-3 py-3 tabular-nums text-muted-foreground">{r.quiz}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.project}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.lastActivity}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[0.65rem] font-bold",
                          r.status === "Completed" && "bg-emerald-50 text-emerald-700",
                          r.status === "In Progress" && "bg-amber-50 text-amber-700",
                          r.status === "Needs Attention" && "bg-rose-50 text-rose-700",
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
