import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Circle, MinusCircle, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";

export const Route = createFileRoute("/student/workbook")({
  head: () => ({ meta: [{ title: "My Workbook · Namma AI" }] }),
  component: MyWorkbook,
});

type Status = "done" | "partial" | "pending";

const PAGES = [
  { m: 1, range: "pp. 4–9",   topic: "Getting Started with CT",  status: "done" as Status,    teacherOk: true,  updated: "Today" },
  { m: 2, range: "pp. 10–17", topic: "Patterns & Sorting",       status: "done" as Status,    teacherOk: true,  updated: "This week" },
  { m: 3, range: "pp. 18–25", topic: "Step-by-step Thinking",    status: "done" as Status,    teacherOk: true,  updated: "This week" },
  { m: 4, range: "pp. 26–33", topic: "Decomposition",            status: "done" as Status,    teacherOk: true,  updated: "Last week" },
  { m: 5, range: "pp. 34–41", topic: "Data Around Us",           status: "partial" as Status, teacherOk: false, updated: "2 days ago" },
  { m: 6, range: "pp. 42–49", topic: "AI Basics",                status: "partial" as Status, teacherOk: false, updated: "Yesterday" },
  { m: 7, range: "pp. 50–57", topic: "Responsible AI",           status: "pending" as Status, teacherOk: false, updated: "Not started" },
  { m: 8, range: "pp. 58–64", topic: "Project & Reflect",        status: "pending" as Status, teacherOk: false, updated: "Not started" },
];

const STATUS_LABEL: Record<Status, string> = { done: "Completed", partial: "Partial", pending: "Pending" };
const STATUS_TONE: Record<Status, string> = {
  done: "bg-success-soft text-success",
  partial: "bg-challenge-soft text-challenge",
  pending: "bg-foreground/5 text-muted-foreground",
};
const STATUS_ICON: Record<Status, React.ReactNode> = {
  done: <CheckCircle2 className="h-4 w-4" />,
  partial: <MinusCircle className="h-4 w-4" />,
  pending: <Circle className="h-4 w-4" />,
};

function MyWorkbook() {
  const done = PAGES.filter((p) => p.status === "done").length;
  const approved = PAGES.filter((p) => p.teacherOk).length;
  const percent = Math.round((done / PAGES.length) * 100);

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-reflect">
            <BookOpen className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">My Workbook Check-ins</span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                Aarav Sharma · Grade 6A
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Mark each workbook mission when you finish it. Your teacher will approve it in class.
              </p>
            </div>
            <div className="rounded-2xl bg-success-soft px-4 py-3 text-success">
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em]">Overall progress</div>
              <div className="font-display text-3xl font-extrabold tabular-nums">{percent}%</div>
              <div className="text-[0.7rem]">{done} of {PAGES.length} completed · {approved} approved</div>
            </div>
          </div>
        </header>

        <section className="grid gap-3">
          {PAGES.map((p) => (
            <article
              key={p.m}
              className="flex flex-wrap items-center gap-4 rounded-[22px] border border-foreground/10 bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${STATUS_TONE[p.status]}`}>
                {STATUS_ICON[p.status]}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Mission {p.m} · {p.range}
                </div>
                <div className="mt-0.5 font-display text-lg font-extrabold text-foreground">{p.topic}</div>
                <div className="text-[0.72rem] text-muted-foreground">Last updated: {p.updated}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] ${STATUS_TONE[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
              {p.teacherOk ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-success">
                  <ShieldCheck className="h-3 w-3" /> Teacher approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Awaiting teacher
                </span>
              )}
              <button
                disabled={p.status === "done"}
                className="rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {p.status === "done" ? "Marked done" : "Mark as done"}
              </button>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
