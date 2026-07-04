import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FolderKanban, Search, XCircle } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { getDemoProjects, type ProjectStatus } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/projects")({
  head: () => ({
    meta: [
      { title: "Project Review · Namma AI" },
      {
        name: "description",
        content: "Approve, comment on and score CT & AI projects from your classes.",
      },
    ],
  }),
  component: TeacherProjects,
});

const STATUS_TONE: Record<ProjectStatus, string> = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-100",
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-100",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Needs Improvement": "bg-rose-50 text-rose-700 border-rose-100",
  Resubmitted: "bg-violet-50 text-violet-700 border-violet-100",
};

function TeacherProjects() {
  const all = React.useMemo(() => getDemoProjects().filter((p) => p.grade === "Grade 6"), []);
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState<"queue" | "reviewed">("queue");

  const queue = all.filter((p) => p.status === "Pending Review" || p.status === "Submitted" || p.status === "Resubmitted");
  const reviewed = all.filter((p) => p.status === "Approved" || p.status === "Needs Improvement");
  const list = (tab === "queue" ? queue : reviewed).filter(
    (p) => !q || `${p.student} ${p.title}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <FolderKanban className="h-3 w-3" /> Teacher · Project Review
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
            Grade 6 project submissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review each project with the CBSE-aligned rubric. Approved projects flow into the
            student portfolio.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Kpi label="In queue" value={queue.length} icon={<Clock className="h-4 w-4" />} tone="amber" />
          <Kpi label="Approved" value={reviewed.filter((r) => r.status === "Approved").length} icon={<CheckCircle2 className="h-4 w-4" />} tone="green" />
          <Kpi label="Needs improvement" value={reviewed.filter((r) => r.status === "Needs Improvement").length} icon={<XCircle className="h-4 w-4" />} tone="rose" />
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden rounded-full border border-border/60">
              {(["queue", "reviewed"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold uppercase tracking-wider",
                    tab === t ? "bg-foreground text-white" : "text-foreground hover:bg-muted/40",
                  )}
                >
                  {t === "queue" ? `Review queue (${queue.length})` : `Reviewed (${reviewed.length})`}
                </button>
              ))}
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search student or title"
                className="w-full rounded-full border border-border/60 bg-muted/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            {list.slice(0, 20).map((p) => (
              <article
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/10 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    {p.student} · {p.grade}
                    {p.section} · Submitted {p.submittedOn}
                  </div>
                  <div className="mt-1 font-display text-base font-extrabold text-foreground">
                    {p.title}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.comment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-display text-lg font-extrabold tabular-nums text-foreground">
                      {p.rubricScore}
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Rubric
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[0.65rem] font-bold",
                      STATUS_TONE[p.status],
                    )}
                  >
                    {p.status}
                  </span>
                  {tab === "queue" && (
                    <div className="flex gap-1.5">
                      <button className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700">
                        Approve
                      </button>
                      <button className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100">
                        Return
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
                Nothing here yet. New submissions appear the moment students upload.
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "amber" | "green" | "rose";
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full",
          tone === "amber" && "bg-amber-50 text-amber-700",
          tone === "green" && "bg-emerald-50 text-emerald-700",
          tone === "rose" && "bg-rose-50 text-rose-700",
        )}
      >
        {icon}
      </span>
      <div className="mt-3 font-display text-2xl font-extrabold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
