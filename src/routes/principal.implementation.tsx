import { createFileRoute } from "@tanstack/react-router";
import { Target, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

import { AppShell } from "@/components/namma/app-shell";
import {
  GRADE_SUMMARIES, WEEKLY_TREND, SCHOOL_STATS, DEMO_CURRENT_WEEK, DEMO_TOTAL_WEEKS,
  getDemoTeachers,
} from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/implementation")({
  head: () => ({ meta: [{ title: "Implementation Tracker · Namma AI" }] }),
  component: ImplementationTracker,
});

function ImplementationTracker() {
  const teachers = getDemoTeachers();

  const weeksProgress = Math.round((DEMO_CURRENT_WEEK / DEMO_TOTAL_WEEKS) * 100);

  // Enrich weekly trend with a teacher-update overlay
  const trend = WEEKLY_TREND.map((w) => ({
    ...w,
    teachers: Math.min(100, 55 + w.week * 5),
  }));

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-challenge">
            <Target className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Implementation Tracker</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Week {DEMO_CURRENT_WEEK} of {DEMO_TOTAL_WEEKS} · {SCHOOL_STATS.overallImplementation}% implementation health
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live view of teacher updates, workbook, portal, projects and observations — the full CBSE loop.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Tile label="Term progress" value={`${weeksProgress}%`} tone="bg-explore-soft text-explore" />
            <Tile label="Teachers active" value={`${SCHOOL_STATS.teachersActiveThisWeek}/${SCHOOL_STATS.teachersTotal}`} tone="bg-decide-soft text-decide" />
            <Tile label="Workbook check-ins" value={SCHOOL_STATS.workbookCheckins.toLocaleString()} tone="bg-success-soft text-success" />
            <Tile label="Evidence items" value={SCHOOL_STATS.evidenceItems.toLocaleString()} tone="bg-bonus-soft text-bonus" />
          </div>
        </header>

        {/* Weekly trend chart */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Weekly implementation trend</h2>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Weeks 1–{DEMO_CURRENT_WEEK}</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 10, right: 16, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground) / 0.08)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={(w) => `W${w}`} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="pct" name="Student completion" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="teachers" name="Teacher updates" stroke="hsl(var(--decide))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Grade rollup */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 font-display text-lg font-extrabold">Grade implementation rollup</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Grade</th>
                  <th className="pb-2 text-right">Teachers</th>
                  <th className="pb-2 text-right">Workbook</th>
                  <th className="pb-2 text-right">Students</th>
                  <th className="pb-2 text-right">Observations</th>
                  <th className="pb-2 text-right">Projects</th>
                  <th className="pb-2">Health</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_SUMMARIES.map((g) => {
                  const tone =
                    g.risk === "On Track" ? "bg-success-soft text-success" :
                    g.risk === "Needs Attention" ? "bg-challenge-soft text-challenge" :
                    "bg-decide-soft text-decide";
                  return (
                    <tr key={g.grade} className="border-b border-foreground/5">
                      <td className="py-2.5 font-semibold text-foreground">{g.label}</td>
                      <td className="py-2.5 text-right tabular-nums">{g.teacherCompletion}%</td>
                      <td className="py-2.5 text-right tabular-nums">{g.workbookTracking}%</td>
                      <td className="py-2.5 text-right tabular-nums">{g.studentCompletion}%</td>
                      <td className="py-2.5 text-right tabular-nums">{g.observations}</td>
                      <td className="py-2.5 text-right tabular-nums text-muted-foreground">{g.projectsCompleted}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${tone}`}>
                          {g.risk === "On Track" ? <CheckCircle2 className="h-3 w-3" /> :
                            g.risk === "Needs Attention" ? <Clock className="h-3 w-3" /> :
                            <AlertTriangle className="h-3 w-3" />}
                          {g.risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Teacher activity */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 font-display text-lg font-extrabold">Teacher activity this week</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {teachers.map((t, i) => {
              const active = i !== 3 && i !== 9; // 2 not active this week
              return (
                <div key={t.teacher_id} className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white px-3 py-2">
                  <div>
                    <div className="font-semibold text-foreground">{t.teacher_name}</div>
                    <div className="text-[0.7rem] text-muted-foreground">Grade {t.grade}{t.section === "*" ? "" : t.section} · {t.subject}</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${
                      active ? "bg-success-soft text-success" : "bg-challenge-soft text-challenge"
                    }`}
                  >
                    {active ? "Updated" : "Pending"}
                  </span>
                </div>
              );
            })}
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
