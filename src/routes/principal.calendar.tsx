import { createFileRoute } from "@tanstack/react-router";
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { DEMO_CURRENT_WEEK, DEMO_TOTAL_WEEKS, DEMO_ACADEMIC_YEAR } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/calendar")({
  head: () => ({ meta: [{ title: "Implementation Calendar · Namma AI" }] }),
  component: CalendarPage,
});

type Kind = "workbook" | "project" | "reflection" | "assessment" | "review" | "certificate";

type WeekPlan = {
  week: number;
  month: string;
  theme: string;
  checkpoints: { label: string; kind: Kind }[];
};

const KIND_TONE: Record<Kind, string> = {
  workbook:    "bg-decide-soft text-decide",
  project:     "bg-bonus-soft text-bonus",
  reflection:  "bg-reflect-soft text-reflect",
  assessment:  "bg-challenge-soft text-challenge",
  review:      "bg-explore-soft text-explore",
  certificate: "bg-xp-soft text-xp",
};

const MONTHS = ["Jun", "Jun", "Jun", "Jun", "Jul", "Jul", "Jul", "Jul", "Jul", "Aug", "Aug", "Aug", "Aug", "Sep", "Sep", "Sep", "Sep", "Oct", "Oct", "Oct", "Oct", "Nov", "Nov", "Nov", "Nov", "Dec", "Dec", "Dec", "Jan", "Jan", "Jan", "Jan", "Feb", "Feb", "Feb"];
const THEMES = [
  "Orientation · Set up class rosters",
  "Patterns in the world around us",
  "Sorting & step-by-step thinking",
  "Decomposition · break the problem",
  "Data around us",
  "AI basics · what is AI?",
  "Pattern recognition in AI",
  "Responsible AI · fairness",
  "AI project kickoff",
  "Mid-term review · Grades 3–5",
  "Mid-term review · Grades 6–8",
  "Project checkpoint · rubric review",
  "Term-end reflections",
  "Term 1 evidence pack",
  "Term 2 orientation",
  "Advanced patterns · algorithmic thinking",
  "Data visualization",
  "AI in industries",
  "No-code AI exploration",
  "Bias & fairness deep dive",
  "AI project lifecycle",
  "Peer review week",
  "Project resubmissions",
  "Term-end observations",
  "Term 2 evidence pack",
  "Term 3 orientation",
  "Cross-grade AI showcase",
  "Reflection & competency scoring",
  "Certificate approvals",
  "Parent showcase preparation",
  "Parent showcase week",
  "Final observations",
  "Final reports compilation",
  "Year-end evidence pack",
  "Certificate distribution",
];

const CHECKPOINT_LIB: Record<number, { label: string; kind: Kind }[]> = {
  1: [{ label: "Workbook check-in", kind: "workbook" }, { label: "Teacher observation", kind: "review" }],
  2: [{ label: "Workbook check-in", kind: "workbook" }, { label: "Class reflection", kind: "reflection" }],
  3: [{ label: "Workbook check-in", kind: "workbook" }, { label: "Weekly assessment", kind: "assessment" }],
  4: [{ label: "Project checkpoint", kind: "project" }, { label: "Teacher observation", kind: "review" }],
};

function planFor(w: number): WeekPlan {
  return {
    week: w,
    month: MONTHS[w - 1] ?? "—",
    theme: THEMES[w - 1] ?? `Week ${w}`,
    checkpoints: CHECKPOINT_LIB[((w - 1) % 4) + 1],
  };
}

function CalendarPage() {
  const weeks: WeekPlan[] = Array.from({ length: DEMO_TOTAL_WEEKS }, (_, i) => planFor(i + 1));

  // Group by month for grid
  const byMonth = weeks.reduce<Record<string, WeekPlan[]>>((acc, w) => {
    (acc[w.month] ||= []).push(w);
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-story">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Implementation Calendar</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Academic year {DEMO_ACADEMIC_YEAR} · {DEMO_TOTAL_WEEKS}-week CT & AI plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly checkpoints across workbook, project, reflection, assessment and review — school-wide.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {(Object.keys(KIND_TONE) as Kind[]).map((k) => (
              <span key={k} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${KIND_TONE[k]}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {k}
              </span>
            ))}
          </div>
        </header>

        <section className="grid gap-6">
          {Object.entries(byMonth).map(([month, list]) => (
            <div key={month + list[0].week} className="rounded-[24px] border border-foreground/10 bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-extrabold text-foreground">{month}</h2>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Weeks {list[0].week}–{list[list.length - 1].week}
                </span>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {list.map((w) => {
                  const past = w.week < DEMO_CURRENT_WEEK;
                  const current = w.week === DEMO_CURRENT_WEEK;
                  return (
                    <article
                      key={w.week}
                      className={`rounded-2xl border p-3 ${
                        current
                          ? "border-decide/40 bg-decide/5"
                          : past
                            ? "border-foreground/10 bg-success-soft/40"
                            : "border-foreground/10 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {past ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : current ? (
                            <Sparkles className="h-4 w-4 text-decide" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                            Week {w.week}
                          </span>
                        </div>
                        {current && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-decide px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white">
                            <Clock className="h-3 w-3" /> This week
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 font-display text-sm font-extrabold leading-snug text-foreground">
                        {w.theme}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {w.checkpoints.map((c, i) => (
                          <span key={i} className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${KIND_TONE[c.kind]}`}>
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
