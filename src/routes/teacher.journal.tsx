import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, AlertTriangle, CheckCircle2 } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { getDemoObservations } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/journal")({
  head: () => ({ meta: [{ title: "Observation Journal · Namma AI" }] }),
  component: JournalPage,
});

function JournalPage() {
  const all = React.useMemo(() => getDemoObservations(), []);
  const [gradeFilter, setGradeFilter] = React.useState("all");
  const [supportOnly, setSupportOnly] = React.useState(false);

  const rows = all.filter((o) => {
    if (gradeFilter !== "all" && o.grade !== gradeFilter) return false;
    if (supportOnly && !o.supportNeeded) return false;
    return true;
  });

  const supportCount = all.filter((o) => o.supportNeeded).length;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-reflect">
            <NotebookPen className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Observation Journal</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {all.length} teacher observations across Grades 3–8
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Entries this term" value={all.length} tone="text-reflect bg-reflect-soft" />
            <Stat label="Students needing support" value={supportCount} tone="text-challenge bg-challenge-soft" />
            <Stat label="Competencies covered" value={8} tone="text-explore bg-explore-soft" />
            <Stat label="Grades active" value={6} tone="text-success bg-success-soft" />
          </div>
        </header>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-2">
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <option value="all">All grades</option>
              {[3,4,5,6,7,8].map((g) => <option key={g}>Grade {g}</option>)}
            </select>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-2 text-sm">
              <input type="checkbox" checked={supportOnly} onChange={(e) => setSupportOnly(e.target.checked)} />
              Needs support only
            </label>
          </div>

          <ul className="mt-4 space-y-2">
            {rows.map((o) => (
              <li key={o.id} className="rounded-2xl border border-foreground/10 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-foreground">{o.student} · {o.grade}</div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {o.competency} · {o.teacher} · {o.date}
                    </div>
                  </div>
                  {o.supportNeeded ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-challenge-soft px-2 py-0.5 text-[0.65rem] font-bold text-challenge">
                      <AlertTriangle className="h-3 w-3" /> Support needed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[0.65rem] font-bold text-success">
                      <CheckCircle2 className="h-3 w-3" /> On track
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{o.observation}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl p-3 ${tone}`}>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-80">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}
