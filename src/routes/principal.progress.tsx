import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";

import { AppShell } from "@/components/namma/app-shell";
import { COMPETENCY_COVERAGE, GRADE_SUMMARIES, getDemoObservations } from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/progress")({
  head: () => ({ meta: [{ title: "Competency Analytics · Namma AI" }] }),
  component: CompetencyAnalytics,
});

/* Deterministic per-grade competency scores derived from GRADE_SUMMARIES so
   the radar and heatmap tell a consistent story. */
function gradeCompetency(gradeIdx: number, competencyIdx: number, base: number): number {
  const drift = ((gradeIdx * 7 + competencyIdx * 11) % 20) - 10;
  const gradeBias = [4, -2, 3, -3, -6, 2][gradeIdx] ?? 0;
  return Math.max(35, Math.min(96, base + drift + gradeBias));
}

function CompetencyAnalytics() {
  const observations = getDemoObservations();
  const supportByCompetency = COMPETENCY_COVERAGE.map((c) => ({
    ...c,
    support: observations.filter((o) => o.competency === c.competency && o.supportNeeded).length,
  }));

  const radarData = COMPETENCY_COVERAGE.map((c, ci) => {
    const row: Record<string, number | string> = { competency: c.competency.replace(" ", "\n") };
    GRADE_SUMMARIES.forEach((g, gi) => {
      row[g.label] = gradeCompetency(gi, ci, c.pct);
    });
    return row;
  });

  const strongest = [...COMPETENCY_COVERAGE].sort((a, b) => b.pct - a.pct)[0];
  const weakest = [...COMPETENCY_COVERAGE].sort((a, b) => a.pct - b.pct)[0];

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-bonus">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">CT & AI Progress</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Competency analytics · School-wide
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            8 CBSE-aligned competencies mapped across Grades 3–8 using workbook, project and observation evidence.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Insight tone="bg-success-soft text-success" icon={<TrendingUp className="h-4 w-4" />} label="Strongest competency" title={strongest.competency} sub={`${strongest.pct}% coverage`} />
            <Insight tone="bg-challenge-soft text-challenge" icon={<AlertTriangle className="h-4 w-4" />} label="Focus area" title={weakest.competency} sub={`${weakest.pct}% coverage · needs deeper practice`} />
            <Insight tone="bg-explore-soft text-explore" icon={<Sparkles className="h-4 w-4" />} label="Recommendation" title="Rotate project reviews weekly" sub="Boosts Project Thinking + Reflection quality" />
          </div>
        </header>

        {/* Coverage bars */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Competency coverage</h2>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Week 9 · Term 1</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={supportByCompetency} margin={{ top: 10, right: 16, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground) / 0.08)" />
                <XAxis dataKey="competency" tick={{ fontSize: 11 }} angle={-18} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: "hsl(var(--foreground) / 0.04)" }} />
                <Bar dataKey="pct" name="Coverage %" fill="hsl(var(--decide))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Radar per grade */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Grade-wise competency radar</h2>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Higher = stronger</span>
          </div>
          <div className="h-[360px] w-full">
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="hsl(var(--foreground) / 0.12)" />
                <PolarAngleAxis dataKey="competency" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                {GRADE_SUMMARIES.map((g, i) => (
                  <Radar
                    key={g.label}
                    name={g.label}
                    dataKey={g.label}
                    stroke={`hsl(${(i * 55 + 200) % 360} 70% 55%)`}
                    fill={`hsl(${(i * 55 + 200) % 360} 70% 55%)`}
                    fillOpacity={0.08}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Heatmap */}
        <section className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Grade × competency heatmap</h2>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">% observed mastery</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">Competency</th>
                  {GRADE_SUMMARIES.map((g) => <th key={g.label} className="pb-2 pr-2 text-center">{g.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPETENCY_COVERAGE.map((c, ci) => (
                  <tr key={c.competency} className="border-t border-foreground/5">
                    <td className="py-2 pr-3 font-semibold text-foreground">{c.competency}</td>
                    {GRADE_SUMMARIES.map((g, gi) => {
                      const v = gradeCompetency(gi, ci, c.pct);
                      const hue = 140; // green
                      const alpha = 0.08 + (v / 100) * 0.55;
                      return (
                        <td key={g.label} className="py-1 pr-2 text-center">
                          <div
                            className="mx-auto flex h-9 w-full max-w-[72px] items-center justify-center rounded-lg text-[0.72rem] font-bold tabular-nums text-foreground"
                            style={{ backgroundColor: `hsl(${hue} 65% 45% / ${alpha})` }}
                          >
                            {v}
                          </div>
                        </td>
                      );
                    })}
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

function Insight({
  tone, icon, label, title, sub,
}: { tone: string; icon: React.ReactNode; label: string; title: string; sub: string }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${tone}`}>
      <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">
        {icon}{label}
      </div>
      <div className="mt-1 font-display text-lg font-extrabold">{title}</div>
      <div className="text-[0.72rem] opacity-80">{sub}</div>
    </div>
  );
}
