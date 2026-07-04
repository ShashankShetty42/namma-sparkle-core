import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileDown,
  Play,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { PLANNER, DEMO_TOTAL_WEEKS } from "@/lib/namma-demo";

export const Route = createFileRoute("/teacher/planner")({
  head: () => ({
    meta: [
      { title: "Weekly Planner · Namma AI" },
      { name: "description", content: "Weekly CT & AI implementation planner for teachers — tasks, checklist and completion tracking." },
    ],
  }),
  component: WeeklyPlanner,
});

function WeeklyPlanner() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-decide/20 bg-decide-soft px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-decide">
                <CalendarClock className="h-3 w-3" /> Weekly Planner
              </span>
              <h1 className="mt-3 font-display text-2xl font-extrabold text-foreground md:text-3xl">
                Week {PLANNER.week} · {PLANNER.grade}-{PLANNER.section}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{PLANNER.focus}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white">
                <Play className="h-4 w-4" /> Update This Week
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5">
                <ClipboardCheck className="h-4 w-4" /> Mark Class Progress
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5">
                <FileDown className="h-4 w-4" /> Generate Class Report
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Meta label="Implementation" value={PLANNER.implementationType} />
            <Meta label="Status" value={PLANNER.status} tone="attention" />
            <Meta label="Duration" value={PLANNER.duration} />
            <Meta label="Weeks in term" value={`${PLANNER.week} / ${DEMO_TOTAL_WEEKS}`} />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-extrabold text-foreground">Teacher tasks this week</h2>
            <ul className="mt-4 space-y-2">
              {PLANNER.teacherTasks.map((t, i) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl bg-foreground/[0.03] p-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-decide-soft text-decide text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg font-extrabold text-foreground">Completion checklist</h2>
            <ul className="mt-4 space-y-3">
              {PLANNER.checklist.map((c) => (
                <li key={c.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      {c.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                      {c.label}
                    </span>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">
                      {c.note ?? `${c.value}%`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/5">
                    <div
                      className={`h-full rounded-full ${c.done ? "bg-success" : "bg-decide"}`}
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-decide">
            <Users className="h-4 w-4" />
            <h2 className="font-display text-lg font-extrabold text-foreground">32 students · Grade 6A</h2>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
            {Array.from({ length: 35 }).map((_, w) => {
              const week = w + 1;
              const done = week < PLANNER.week;
              const current = week === PLANNER.week;
              return (
                <div
                  key={week}
                  className={`rounded-xl border p-2 text-center text-xs font-bold ${
                    current
                      ? "border-decide bg-decide-soft text-decide"
                      : done
                        ? "border-success/30 bg-success-soft text-success"
                        : "border-foreground/10 bg-white text-muted-foreground"
                  }`}
                >
                  W{week}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Meta({ label, value, tone }: { label: string; value: string; tone?: "attention" }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-3">
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-1 text-sm font-bold ${tone === "attention" ? "text-challenge" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
