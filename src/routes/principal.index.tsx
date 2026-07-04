import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  Info,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/namma/app-shell";
import { cn } from "@/lib/utils";
import {
  COMPETENCY_COVERAGE,
  DEMO_ACADEMIC_YEAR,
  DEMO_CURRENT_WEEK,
  DEMO_SCHOOL_NAME,
  DEMO_TOTAL_WEEKS,
  EVIDENCE_MIX,
  GRADE_SUMMARIES,
  SCHOOL_STATS,
  SMART_ALERTS,
  WEEKLY_TREND,
  type AlertTone,
  type GradeSummary,
} from "@/lib/namma-demo";

export const Route = createFileRoute("/principal/")({
  head: () => ({
    meta: [
      { title: "School Command Centre · Namma AI" },
      {
        name: "description",
        content:
          "Track CT & AI implementation across Grades 3–8 with implementation health, evidence readiness, grade drill-downs and smart alerts.",
      },
      { property: "og:title", content: "CT & AI Implementation Command Centre" },
      {
        property: "og:description",
        content:
          "Premium dashboard for CBSE schools implementing Computational Thinking and Artificial Intelligence for Grades 3–8.",
      },
    ],
  }),
  component: PrincipalCommandCentre,
});

const HEALTH_BREAKDOWN = [
  { label: "Teacher updates", score: 20, max: 25 },
  { label: "Student completion", score: 18, max: 25 },
  { label: "Workbook check-ins", score: 16, max: 20 },
  { label: "Project evidence", score: 12, max: 15 },
  { label: "Assessment records", score: 8, max: 10 },
  { label: "Observation journals", score: 7, max: 10 },
  { label: "Report readiness", score: 5, max: 5 },
];

const RECOMMENDED_ACTIONS = [
  { label: "Follow up with Grade 7B teacher", to: "/principal/teachers", icon: Users },
  { label: "Review pending Grade 6 AI projects", to: "/teacher/projects", icon: FolderKanban },
  { label: "Generate July Evidence Pack", to: "/principal/evidence", icon: FileSpreadsheet },
  { label: "Schedule project week for Grades 6–8", to: "/principal/calendar", icon: Target },
  { label: "Review certificate eligibility list", to: "/principal/certificates", icon: Award },
  { label: "Check classes silent for 7+ days", to: "/principal/teachers", icon: AlertTriangle },
];

const DONUT_COLORS = ["#2563eb", "#7c3aed", "#f59e0b", "#10b981", "#ef4444", "#6366f1"];

function PrincipalCommandCentre() {
  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        <HeroBar />
        <KpiGrid />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <HealthBreakdown />
          <WeeklyTrendCard />
          <EvidenceDonut />
        </div>
        <GradeGrid />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <GradeBarChart />
          <CompetencyBars />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SmartInsights />
          <RecommendedActions />
        </div>
      </div>
    </AppShell>
  );
}

/* ─────────── Hero ─────────── */

function HeroBar() {
  return (
    <section className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Principal · School Command Centre
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            {DEMO_SCHOOL_NAME}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Academic Year {DEMO_ACADEMIC_YEAR} · Week {DEMO_CURRENT_WEEK} of {DEMO_TOTAL_WEEKS} ·
            Grades 3–8 · CBSE Affiliated
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/principal/reports"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted/40"
          >
            <FileBarChart className="h-4 w-4" /> View reports
          </Link>
          <Link
            to="/principal/evidence"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            <Download className="h-4 w-4" /> July evidence pack
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── KPI grid ─────────── */

const KPIS: {
  label: string;
  value: string | number;
  hint: string;
  status: "green" | "amber" | "red" | "blue";
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  trend?: string;
}[] = [
  {
    label: "Implementation Health",
    value: `${SCHOOL_STATS.overallImplementation} / 100`,
    hint: "Good · +6 vs last month",
    status: "green",
    icon: Activity,
    to: "/principal/implementation",
    trend: "+6%",
  },
  {
    label: "Evidence Readiness",
    value: "74%",
    hint: `${SCHOOL_STATS.evidenceItems.toLocaleString()} items collected`,
    status: "green",
    icon: FileSpreadsheet,
    to: "/principal/evidence",
  },
  {
    label: "Students On Track",
    value: SCHOOL_STATS.studentsOnTrack,
    hint: `${SCHOOL_STATS.studentsNeedingAttention} need attention · ${SCHOOL_STATS.studentsDelayed} delayed`,
    status: "amber",
    icon: GraduationCap,
    to: "/principal/students",
  },
  {
    label: "Teacher Updates",
    value: `${SCHOOL_STATS.teachersActiveThisWeek} / ${SCHOOL_STATS.teachersTotal}`,
    hint: "Active this week",
    status: "amber",
    icon: Users,
    to: "/principal/teachers",
  },
  {
    label: "Project Review Backlog",
    value: 42,
    hint: "Across Grades 6–8",
    status: "amber",
    icon: FolderKanban,
    to: "/teacher/projects",
  },
  {
    label: "Certificate Eligibility",
    value: SCHOOL_STATS.certificatesEligible,
    hint: "Ready for principal approval",
    status: "green",
    icon: Award,
    to: "/principal/certificates",
  },
];

function KpiGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k) => (
        <Link
          key={k.label}
          to={k.to}
          className="group rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:border-foreground/30 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className={cn("grid h-9 w-9 place-items-center rounded-full", statusBg(k.status))}>
              <k.icon className={cn("h-4 w-4", statusFg(k.status))} />
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold tabular-nums text-foreground">
            {k.value}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {k.label}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{k.hint}</p>
          {k.trend && (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-700">
              <TrendingUp className="h-3 w-3" /> {k.trend}
            </span>
          )}
        </Link>
      ))}
    </section>
  );
}

/* ─────────── Health breakdown ─────────── */

function HealthBreakdown() {
  return (
    <Card title="Health Score Breakdown" eyebrow="How the 76 / 100 is calculated">
      <div className="space-y-3">
        {HEALTH_BREAKDOWN.map((h) => {
          const pct = (h.score / h.max) * 100;
          return (
            <div key={h.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{h.label}</span>
                <span className="font-bold tabular-nums text-muted-foreground">
                  {h.score} / {h.max}
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-muted/60">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : "bg-amber-500",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─────────── Weekly trend chart ─────────── */

function WeeklyTrendCard() {
  return (
    <Card title="Weekly Completion Trend" eyebrow={`Weeks 1–${DEMO_CURRENT_WEEK}`}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={WEEKLY_TREND}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tickFormatter={(v) => `W${v}`}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v: number) => [`${v}%`, "Completion"]}
            labelFormatter={(l) => `Week ${l}`}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="pct"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#2563eb" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

/* ─────────── Evidence donut ─────────── */

function EvidenceDonut() {
  return (
    <Card title="Evidence Collected" eyebrow={`${SCHOOL_STATS.evidenceItems.toLocaleString()} artefacts`}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="60%" height={180}>
          <PieChart>
            <Pie
              data={EVIDENCE_MIX}
              dataKey="pct"
              nameKey="label"
              innerRadius={45}
              outerRadius={75}
              stroke="none"
            >
              {EVIDENCE_MIX.map((_, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => [`${v}%`, ""]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-1.5 text-xs">
          {EVIDENCE_MIX.map((e, i) => (
            <li key={e.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="flex-1 text-foreground">{e.label}</span>
              <span className="font-bold tabular-nums text-muted-foreground">{e.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ─────────── Grade grid ─────────── */

function GradeGrid() {
  return (
    <section>
      <SectionHead
        title="Grade Overview · 3–8"
        subtitle="Click any grade to open the drill-down dashboard."
        action={{ label: "All grades", to: "/principal/grades" }}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GRADE_SUMMARIES.map((g) => (
          <GradeCard key={g.grade} g={g} />
        ))}
      </div>
    </section>
  );
}

function GradeCard({ g }: { g: GradeSummary }) {
  const status = g.risk === "On Track" ? "green" : g.risk === "Needs Attention" ? "amber" : "red";
  return (
    <Link
      to="/principal/grades/$grade"
      params={{ grade: String(g.grade) }}
      className="group block rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:border-foreground/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-extrabold text-foreground">{g.label}</h3>
            <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">
              {g.track}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{g.focus}</p>
        </div>
        <StatusPill status={status}>{g.risk}</StatusPill>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Students" value={g.students} />
        <Metric label="Week" value={`${g.currentWeek} / 35`} />
        <MetricBar label="Implementation" value={g.studentCompletion} />
        <MetricBar label="Workbook" value={g.workbookTracking} />
        {g.track === "CT+AI" && (
          <>
            <MetricBar label="AI activity" value={g.aiActivity ?? 0} />
            <MetricBar label="Projects" value={g.projectCompletion ?? 0} />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
        <span className="text-muted-foreground">Observations: {g.observations}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-foreground opacity-0 transition group-hover:opacity-100">
          Drill down <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

/* ─────────── Grade bar chart ─────────── */

function GradeBarChart() {
  const data = GRADE_SUMMARIES.map((g) => ({ grade: g.label.replace("Grade ", "G"), pct: g.studentCompletion }));
  return (
    <Card title="Grade-wise Implementation" eyebrow="Student completion %">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v: number) => [`${v}%`, "Completion"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.pct >= 75 ? "#10b981" : d.pct >= 65 ? "#f59e0b" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function CompetencyBars() {
  return (
    <Card title="Competency Coverage" eyebrow="School-wide" className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {COMPETENCY_COVERAGE.map((c) => (
          <div key={c.competency}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground">{c.competency}</span>
              <span className="font-bold tabular-nums text-muted-foreground">{c.pct}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-muted/60">
              <div
                className={cn(
                  "h-full rounded-full",
                  c.pct >= 75 ? "bg-emerald-500" : c.pct >= 65 ? "bg-blue-500" : "bg-amber-500",
                )}
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────── Smart insights + actions ─────────── */

function SmartInsights() {
  return (
    <Card
      title="Smart Insights"
      eyebrow={`${SMART_ALERTS.length} findings this week`}
      className="lg:col-span-2"
    >
      <ul className="space-y-2">
        {SMART_ALERTS.map((a) => (
          <li
            key={a.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3",
              alertBg(a.tone),
            )}
          >
            <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full", alertIconBg(a.tone))}>
              {alertIcon(a.tone)}
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">{a.title}</div>
              <p className="text-xs text-muted-foreground">{a.body}</p>
            </div>
            <button className="shrink-0 rounded-full border border-border/60 bg-white px-3 py-1 text-[0.7rem] font-semibold text-foreground hover:bg-muted/40">
              Act
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RecommendedActions() {
  return (
    <Card title="Recommended Next Actions" eyebrow="Prioritised for this week">
      <ul className="space-y-2">
        {RECOMMENDED_ACTIONS.map((a) => (
          <li key={a.label}>
            <Link
              to={a.to}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-white p-3 text-sm transition hover:border-foreground/30 hover:bg-muted/20"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted/50">
                <a.icon className="h-4 w-4 text-foreground" />
              </span>
              <span className="flex-1 font-semibold text-foreground">{a.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ─────────── Reusable primitives ─────────── */

function Card({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-white p-5 shadow-sm", className)}>
      {eyebrow && (
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h3 className="mt-0.5 font-display text-base font-extrabold text-foreground">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="font-display text-lg font-extrabold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40"
        >
          {action.label} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/30 px-3 py-2">
      <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-sm font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/30 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums text-foreground">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 75 ? "bg-emerald-500" : value >= 65 ? "bg-blue-500" : value >= 50 ? "bg-amber-500" : "bg-red-500",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatusPill({
  status,
  children,
}: {
  status: "green" | "amber" | "red" | "blue";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
        status === "green" && "bg-emerald-50 text-emerald-700",
        status === "amber" && "bg-amber-50 text-amber-700",
        status === "red" && "bg-red-50 text-red-700",
        status === "blue" && "bg-blue-50 text-blue-700",
      )}
    >
      {children}
    </span>
  );
}

/* ─────────── Status helpers ─────────── */

function statusBg(s: "green" | "amber" | "red" | "blue") {
  return s === "green"
    ? "bg-emerald-50"
    : s === "amber"
      ? "bg-amber-50"
      : s === "red"
        ? "bg-red-50"
        : "bg-blue-50";
}
function statusFg(s: "green" | "amber" | "red" | "blue") {
  return s === "green"
    ? "text-emerald-600"
    : s === "amber"
      ? "text-amber-600"
      : s === "red"
        ? "text-red-600"
        : "text-blue-600";
}

function alertBg(tone: AlertTone) {
  return tone === "positive"
    ? "border-emerald-100 bg-emerald-50/40"
    : tone === "attention"
      ? "border-amber-100 bg-amber-50/40"
      : tone === "delayed"
        ? "border-red-100 bg-red-50/40"
        : "border-blue-100 bg-blue-50/40";
}
function alertIconBg(tone: AlertTone) {
  return tone === "positive"
    ? "bg-emerald-100 text-emerald-700"
    : tone === "attention"
      ? "bg-amber-100 text-amber-700"
      : tone === "delayed"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";
}
function alertIcon(tone: AlertTone) {
  const cls = "h-4 w-4";
  if (tone === "positive") return <CheckCircle2 className={cls} />;
  if (tone === "delayed") return <AlertTriangle className={cls} />;
  if (tone === "attention") return <ClipboardList className={cls} />;
  return <Info className={cls} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _kept = BookOpenCheck;
