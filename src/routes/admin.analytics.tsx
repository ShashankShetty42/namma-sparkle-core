import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, Users, GraduationCap, FileSpreadsheet, Award } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from "recharts";

import { AppShell } from "@/components/namma/app-shell";
import { ADMIN_SCOPE } from "@/lib/namma-demo";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Platform Analytics · Namma AI" }] }),
  component: AdminAnalytics,
});

const ADOPTION = [
  { month: "Feb", schools: 2, teachers: 24, students: 610 },
  { month: "Mar", schools: 3, teachers: 41, students: 980 },
  { month: "Apr", schools: 4, teachers: 58, students: 1420 },
  { month: "May", schools: 5, teachers: 71, students: 1780 },
  { month: "Jun", schools: 6, teachers: 92, students: 2210 },
  { month: "Jul", schools: 8, teachers: 116, students: 2840 },
];

const WEEKLY_ACROSS = [
  { week: "W1", pct: 38 }, { week: "W2", pct: 46 }, { week: "W3", pct: 54 },
  { week: "W4", pct: 61 }, { week: "W5", pct: 65 }, { week: "W6", pct: 69 },
  { week: "W7", pct: 71 }, { week: "W8", pct: 73 }, { week: "W9", pct: 75 },
];

const TOP_SCHOOLS = [
  { name: "Namma Vidya Public School",     city: "Bengaluru",  imp: 76, students: 384 },
  { name: "Cambridge Heritage School",     city: "Mysuru",     imp: 71, students: 412 },
  { name: "Sunrise International",         city: "Bengaluru",  imp: 68, students: 328 },
  { name: "Deccan Public School",          city: "Hyderabad",  imp: 64, students: 468 },
  { name: "Vidyashram Central",            city: "Chennai",    imp: 61, students: 356 },
  { name: "Ekya Learning Community",       city: "Bengaluru",  imp: 58, students: 292 },
  { name: "Presidency Model School",       city: "Kochi",      imp: 54, students: 244 },
  { name: "Green Valley Academy",          city: "Pune",       imp: 49, students: 356 },
];

function AdminAnalytics() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <header className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-success">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]">Platform Analytics</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Namma AI across {ADMIN_SCOPE.schoolsOnboarded} schools
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Adoption, active use, and evidence throughput across the network.</p>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Kpi label="Schools onboarded" value={ADMIN_SCOPE.schoolsOnboarded} icon={<Building2 className="h-3.5 w-3.5" />} tone="bg-decide-soft text-decide" />
            <Kpi label="Teachers active" value={ADMIN_SCOPE.teachersActive} icon={<Users className="h-3.5 w-3.5" />} tone="bg-explore-soft text-explore" />
            <Kpi label="Students reached" value={ADMIN_SCOPE.totalStudentsAcross.toLocaleString()} icon={<GraduationCap className="h-3.5 w-3.5" />} tone="bg-bonus-soft text-bonus" />
            <Kpi label="Reports generated" value={ADMIN_SCOPE.reportsGenerated} icon={<FileSpreadsheet className="h-3.5 w-3.5" />} tone="bg-success-soft text-success" />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card title="Adoption trend · 6 months">
            <div className="h-[240px]">
              <ResponsiveContainer>
                <LineChart data={ADOPTION} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.08)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="schools" stroke="hsl(var(--decide))" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="teachers" stroke="hsl(var(--explore))" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Weekly completion (all schools)">
            <div className="h-[240px]">
              <ResponsiveContainer>
                <BarChart data={WEEKLY_ACROSS} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.08)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="pct" name="% students on track" fill="hsl(var(--success))" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="rounded-[24px] border border-foreground/10 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Schools · implementation ranking</h2>
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <Award className="h-3.5 w-3.5" /> {ADMIN_SCOPE.evidencePacks} evidence packs generated
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-2">#</th>
                  <th className="pb-2">School</th>
                  <th className="pb-2">City</th>
                  <th className="pb-2 text-right">Students</th>
                  <th className="pb-2 text-right">Implementation</th>
                </tr>
              </thead>
              <tbody>
                {TOP_SCHOOLS.map((s, i) => (
                  <tr key={s.name} className="border-b border-foreground/5">
                    <td className="py-2.5 tabular-nums text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 font-semibold text-foreground">{s.name}</td>
                    <td className="py-2.5 text-muted-foreground">{s.city}</td>
                    <td className="py-2.5 text-right tabular-nums">{s.students}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                        s.imp >= 70 ? "bg-success-soft text-success" :
                        s.imp >= 55 ? "bg-challenge-soft text-challenge" :
                        "bg-decide-soft text-decide"
                      }`}>{s.imp}%</span>
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

function Kpi({ label, value, tone, icon }: { label: string; value: React.ReactNode; tone: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] opacity-80">{icon}{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-foreground/10 bg-white p-5 shadow-[var(--shadow-soft)]">
      <h2 className="mb-2 font-display text-base font-extrabold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
