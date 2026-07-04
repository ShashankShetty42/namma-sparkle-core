import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  FileBarChart,
  FolderKanban,
  NotebookPen,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import { PLANNER, getDemoCompletionRows, type CompletionRow } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/")({
  head: () => ({
    meta: [
      { title: "Teacher Weekly Workspace · Namma AI" },
      {
        name: "description",
        content:
          "Weekly implementation checklist, quick-update mode and student completion tracker for the CBSE CT & AI programme.",
      },
    ],
  }),
  component: TeacherWorkspace,
});

const TEACHER = {
  name: "Ms. Ritu Malhotra",
  className: "Grade 6A",
  students: 32,
  week: 8,
  subject: "CT & AI",
  status: "Needs Attention",
};

const WEEKLY_TASKS = [
  { label: "Confirm workbook completion", due: "Today", done: false },
  { label: "Add class observation", due: "Today", done: false },
  { label: "Review pending submissions", due: "Tomorrow", done: false },
  { label: "Update competency notes", due: "This week", done: true },
  { label: "Mark students needing support", due: "This week", done: false },
  { label: "Generate weekly class report", due: "Friday", done: false },
];

function TeacherWorkspace() {
  const rows = React.useMemo(() => getDemoCompletionRows(), []);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | CompletionRow["status"]>("all");
  const [quickOpen, setQuickOpen] = React.useState(false);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (query && !r.student.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const totals = {
    workbook: rows.filter((r) => r.workbook === "Completed").length,
    portal: rows.filter((r) => r.portal === "Completed").length,
    reflection: rows.filter((r) => r.reflection === "Submitted").length,
    project: rows.filter((r) => r.project === "Submitted").length,
    pendingApproval: rows.filter((r) => r.approval === "Needs Review" || r.approval === "Pending").length,
    needsSupport: rows.filter((r) => r.status === "Needs Attention").length,
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        {/* Header */}
        <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Teacher · Weekly workspace
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground">
                {TEACHER.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Active Program: <strong>CBSE CT & AI</strong> · {TEACHER.className} ·{" "}
                {TEACHER.students} students · Current Tracking Period: October Week 2
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setQuickOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                <Zap className="h-4 w-4" /> Quick update mode
              </button>
              <Link
                to="/teacher/reports"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/40"
              >
                <FileBarChart className="h-4 w-4" /> Weekly report
              </Link>
            </div>
          </div>
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Kpi label="Workbook" value={`${totals.workbook} / ${rows.length}`} icon={BookOpenCheck} tone="blue" />
          <Kpi label="Portal / Activity" value={`${totals.portal} / ${rows.length}`} icon={ClipboardList} tone="blue" />
          <Kpi label="Reflections" value={`${totals.reflection} / ${rows.length}`} icon={NotebookPen} tone="blue" />
          <Kpi label="Projects" value={`${totals.project} / ${rows.length}`} icon={FolderKanban} tone="blue" />
          <Kpi label="Approvals pending" value={totals.pendingApproval} icon={AlertTriangle} tone="amber" />
          <Kpi label="Needs support" value={totals.needsSupport} icon={Users} tone="red" />
          <Kpi label="Observations · month" value={31} icon={NotebookPen} tone="green" />
        </section>

        {/* Weekly checklist */}
        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Week {PLANNER.week} · {PLANNER.focus}
              </div>
              <h2 className="font-display text-lg font-extrabold text-foreground">
                This week's implementation checklist
              </h2>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {WEEKLY_TASKS.map((t) => (
              <li
                key={t.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  t.done ? "border-emerald-100 bg-emerald-50/30" : "border-border/60 bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full",
                    t.done ? "bg-emerald-100 text-emerald-700" : "bg-muted/40 text-muted-foreground",
                  )}
                >
                  {t.done ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{t.label}</div>
                  <div className="text-[0.7rem] text-muted-foreground">Due · {t.due}</div>
                </div>
                <button className="rounded-full border border-border/60 bg-white px-3 py-1 text-[0.7rem] font-semibold text-foreground hover:bg-muted/40">
                  {t.done ? "View" : "Do it"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Student completion table */}
        <section className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Grade 6A · {rows.length} students
              </div>
              <h2 className="font-display text-lg font-extrabold text-foreground">
                Student completion tracker
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search student"
                  className="w-52 rounded-full border border-border/60 bg-white pl-8 pr-3 py-1.5 text-xs focus:border-foreground focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pl-2">Student</th>
                  <th className="py-2">Workbook</th>
                  <th className="py-2">Portal</th>
                  <th className="py-2">Quiz</th>
                  <th className="py-2">Reflection</th>
                  <th className="py-2">Project</th>
                  <th className="py-2">Approval</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Last</th>
                  <th className="py-2 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.student} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="py-2 pl-2 font-semibold text-foreground">{r.student}</td>
                    <td className="py-2"><CellPill v={r.workbook} /></td>
                    <td className="py-2"><CellPill v={r.portal} /></td>
                    <td className="py-2 tabular-nums text-foreground">{r.quiz}</td>
                    <td className="py-2"><CellPill v={r.reflection} /></td>
                    <td className="py-2"><CellPill v={r.project} /></td>
                    <td className="py-2"><CellPill v={r.approval} /></td>
                    <td className="py-2"><StatusPill s={r.status} /></td>
                    <td className="py-2 text-muted-foreground">{r.lastActivity}</td>
                    <td className="py-2 pr-2 text-right">
                      <button className="rounded-full border border-border/60 bg-white px-2.5 py-1 text-[0.65rem] font-semibold hover:bg-muted/40">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-muted-foreground">
                      No students match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {quickOpen && <QuickUpdateModal onClose={() => setQuickOpen(false)} count={rows.length} />}
    </AppShell>
  );
}

/* ─────────── Quick update modal ─────────── */

function QuickUpdateModal({ onClose, count }: { onClose: () => void; count: number }) {
  const actions = [
    { label: `Mark entire class workbook completed (${count} students)`, icon: BookOpenCheck },
    { label: "Mark selected students completed", icon: CheckCircle2 },
    { label: "Add observation for selected students", icon: NotebookPen },
    { label: "Upload class evidence photo", icon: ClipboardList },
    { label: "Assign project status", icon: FolderKanban },
    { label: "Approve selected submissions", icon: CheckCircle2 },
    { label: "Generate class report", icon: FileBarChart },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl border border-border/60 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Quick update mode
            </div>
            <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
              Do a week of work in 60 seconds
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-semibold hover:bg-muted/40"
          >
            Close
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {actions.map((a) => (
            <li key={a.label}>
              <button className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-white p-3 text-left transition hover:border-foreground/30 hover:bg-muted/20">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-muted/40">
                  <a.icon className="h-4 w-4 text-foreground" />
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">{a.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────── Small components ─────────── */

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tone: "blue" | "green" | "amber" | "red";
}) {
  const bg =
    tone === "green" ? "bg-emerald-50 text-emerald-700"
    : tone === "amber" ? "bg-amber-50 text-amber-700"
    : tone === "red" ? "bg-red-50 text-red-700"
    : "bg-blue-50 text-blue-700";
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={cn("grid h-8 w-8 place-items-center rounded-full", bg)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 font-display text-xl font-extrabold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function CellPill({ v }: { v: string }) {
  const tone =
    v === "Completed" || v === "Submitted" || v === "Approved"
      ? "bg-emerald-50 text-emerald-700"
      : v === "Partial" || v === "Needs Review" || v === "Pending"
        ? "bg-amber-50 text-amber-700"
        : v === "Not Started"
          ? "bg-muted/60 text-muted-foreground"
          : "bg-blue-50 text-blue-700";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", tone)}>{v}</span>
  );
}

function StatusPill({ s }: { s: CompletionRow["status"] }) {
  const tone =
    s === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : s === "In Progress"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider", tone)}>
      {s}
    </span>
  );
}
