import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookText, CheckCircle2, Circle, MinusCircle, Search, Download } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { getDemoCompletionRows, GRADE_SUMMARIES } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/workbook")({
  head: () => ({ meta: [{ title: "Workbook Tracker · Namma AI" }] }),
  component: WorkbookTracker,
});

/* Workbook page ranges per CBSE mission (1–8). */
const WORKBOOK_PAGES = [
  { m: 1, range: "pp. 4–9", topic: "Getting started" },
  { m: 2, range: "pp. 10–17", topic: "Patterns & sorting" },
  { m: 3, range: "pp. 18–25", topic: "Step-by-step thinking" },
  { m: 4, range: "pp. 26–33", topic: "Decomposition" },
  { m: 5, range: "pp. 34–41", topic: "Data around us" },
  { m: 6, range: "pp. 42–49", topic: "AI basics" },
  { m: 7, range: "pp. 50–57", topic: "Responsible AI" },
  { m: 8, range: "pp. 58–64", topic: "Project & reflect" },
];

type Cell = "done" | "partial" | "pending";

function cellFor(rowIdx: number, missionIdx: number, statusPattern: string): Cell {
  // Deterministic per (row, mission)
  const base =
    statusPattern === "Completed" ? 0.92 :
    statusPattern === "In Progress" ? 0.62 :
    0.28;
  const taper = 1 - (missionIdx * 0.09);
  const p = base * taper;
  const hash = ((rowIdx * 131 + missionIdx * 17 + 7) % 100) / 100;
  if (hash < p - 0.15) return "done";
  if (hash < p + 0.05) return "partial";
  return "pending";
}

const CELL_STYLES: Record<Cell, string> = {
  done: "bg-success-soft text-success",
  partial: "bg-challenge-soft text-challenge",
  pending: "bg-foreground/5 text-muted-foreground",
};
const CELL_ICON: Record<Cell, React.ReactNode> = {
  done: <CheckCircle2 className="h-3.5 w-3.5" />,
  partial: <MinusCircle className="h-3.5 w-3.5" />,
  pending: <Circle className="h-3.5 w-3.5" />,
};

function WorkbookTracker() {
  const rows = React.useMemo(() => getDemoCompletionRows(), []);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [classId, setClassId] = React.useState("Grade 6A");

  const filtered = rows.filter((r) => {
    if (q && !r.student.toLowerCase().includes(q.toLowerCase())) return false;
    if (statusFilter === "attention" && r.status === "Completed") return false;
    if (statusFilter === "completed" && r.status !== "Completed") return false;
    return true;
  });

  // Summary tiles
  const stats = React.useMemo(() => {
    let done = 0, partial = 0, pending = 0;
    rows.forEach((r, i) => {
      WORKBOOK_PAGES.forEach((_, mi) => {
        const c = cellFor(i, mi, r.status);
        if (c === "done") done++;
        else if (c === "partial") partial++;
        else pending++;
      });
    });
    const total = done + partial + pending || 1;
    return {
      done, partial, pending,
      completion: Math.round((done / total) * 100),
      studentsUpdated: rows.filter((r) => r.lastActivity === "Today" || r.lastActivity === "Yesterday").length,
      needApproval: rows.filter((r) => r.status !== "Completed").length,
    };
  }, [rows]);

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-challenge">
            <BookText className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Workbook Tracker</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                CBSE Workbook — {classId}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                8 missions · {rows.length} students · Weekly check-ins signed off by the class teacher.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-foreground/5">
              <Download className="h-3.5 w-3.5" /> Export workbook report
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Tile label="Workbook completion" value={`${stats.completion}%`} tone="bg-success-soft text-success" />
            <Tile label="Pages completed" value={stats.done} tone="bg-explore-soft text-explore" />
            <Tile label="Pages partially done" value={stats.partial} tone="bg-challenge-soft text-challenge" />
            <Tile label="Students needing follow-up" value={stats.needApproval} tone="bg-decide-soft text-decide" />
          </div>
        </header>

        {/* Grade quick-jump */}
        <section className="rounded-[24px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Classes</span>
            {GRADE_SUMMARIES.flatMap((g) => ["A", "B"].map((s) => `${g.label} ${s}`)).map((c) => (
              <button
                key={c}
                onClick={() => setClassId(c.replace(" ", "").replace("Grade", "Grade "))}
                className={`rounded-full border px-3 py-1 font-semibold ${
                  classId === c.replace(" ", "").replace("Grade", "Grade ")
                    ? "border-decide bg-decide/10 text-decide"
                    : "border-foreground/10 bg-white text-muted-foreground hover:bg-foreground/5"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Filters */}
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
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All students</option>
              <option value="completed">Completed only</option>
              <option value="attention">Needs attention</option>
            </select>
            <div className="ml-auto flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <LegendDot cls="bg-success" label="Completed" />
              <LegendDot cls="bg-challenge" label="Partial" />
              <LegendDot cls="bg-foreground/25" label="Pending" />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2 pr-3">Student</th>
                  {WORKBOOK_PAGES.map((p) => (
                    <th key={p.m} className="pb-2 pr-2 text-center">
                      <div>M{p.m}</div>
                      <div className="font-normal normal-case tracking-normal text-[0.6rem] text-muted-foreground/70">{p.range}</div>
                    </th>
                  ))}
                  <th className="pb-2 text-right">Last update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.student} className="border-b border-foreground/5">
                    <td className="py-2 pr-3">
                      <div className="font-semibold text-foreground">{r.student}</div>
                      <div className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{r.status}</div>
                    </td>
                    {WORKBOOK_PAGES.map((p, mi) => {
                      const c = cellFor(i, mi, r.status);
                      return (
                        <td key={p.m} className="py-2 pr-2 text-center">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${CELL_STYLES[c]}`} title={`${p.topic} · ${c}`}>
                            {CELL_ICON[c]}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{r.lastActivity}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={WORKBOOK_PAGES.length + 2} className="py-6 text-center text-sm text-muted-foreground">No students match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Tile({ label, value, tone }: { label: string; value: React.ReactNode; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function LegendDot({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${cls}`} />
      {label}
    </span>
  );
}
