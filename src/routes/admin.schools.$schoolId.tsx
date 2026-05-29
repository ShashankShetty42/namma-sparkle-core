import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Building2,
  GraduationCap,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  getSchool,
  getSchoolStats,
  GRADE_OPTIONS,
  onAdminState,
} from "@/lib/namma-admin";

export const Route = createFileRoute("/admin/schools/$schoolId")({
  head: () => ({ meta: [{ title: "School overview · Namma AI" }] }),
  component: ViewSchool,
});

function ViewSchool() {
  const { schoolId } = Route.useParams();
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => onAdminState(() => setTick((t) => t + 1)), []);

  const school = React.useMemo(() => getSchool(schoolId), [tick, schoolId]);
  const stats = React.useMemo(() => getSchoolStats(schoolId), [tick, schoolId]);

  if (!school) {
    return (
      <AppShell>
        <div className="shell-inner">
          <div className="rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              School not found.{" "}
              <Link to="/admin/schools" className="font-bold underline">
                Back to schools
              </Link>
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const maxInDist = Math.max(1, ...Object.values(stats.distribution));

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-bonus-soft via-white to-challenge-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-bonus/25 blur-3xl" />
          <div className="relative space-y-3">
            <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-2xl">
              <Link to="/admin/schools">
                <ArrowLeft className="h-4 w-4" /> All schools
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              {school.school_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-foreground/5 px-3 py-1 font-mono text-xs font-bold text-foreground">
                {school.school_id}
              </span>
              {school.principal_name && <span>Principal · {school.principal_name}</span>}
              {(school.city || school.state) && (
                <span>{[school.city, school.state].filter(Boolean).join(", ")}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="hero" size="sm">
                <Link to="/admin/students" search={{ school: school.school_id }}>
                  <UserPlus className="h-4 w-4" /> Add students
                </Link>
              </Button>
              <Button asChild variant="soft" size="sm">
                <Link to="/admin/teachers" search={{ school: school.school_id }}>
                  <UserPlus className="h-4 w-4" /> Add teacher
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Overview metrics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric tone="story" label="Total Students" value={stats.totalStudents} icon={GraduationCap} />
          <Metric tone="explore" label="Total Teachers" value={stats.totalTeachers} icon={Users} />
          <Metric tone="bonus" label="Activities Completed" value={stats.activitiesCompleted} icon={Award} />
          <Metric tone="challenge" label="Avg Completion %" value={`${stats.averageCompletion}%`} icon={TrendingUp} />
        </section>

        {/* Grade distribution */}
        <section className="section-panel">
          <div className="eyebrow">
            <GraduationCap className="h-3.5 w-3.5" /> Students by grade
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Grade distribution
          </h2>
          <div className="mt-6 space-y-3">
            {GRADE_OPTIONS.map((g) => {
              const count = stats.distribution[g] ?? 0;
              const pct = Math.round((count / maxInDist) * 100);
              return (
                <div key={g} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-bold text-foreground">{g}</div>
                  <div className="flex-1 h-3 overflow-hidden rounded-full bg-secondary/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: nammaEase }}
                      className="h-full rounded-full bg-gradient-to-r from-story via-bonus to-challenge"
                    />
                  </div>
                  <div className="w-12 text-right font-reward text-base text-foreground">{count}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({
  tone,
  label,
  value,
  icon: Icon,
}: {
  tone: string;
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-soft)]">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${tone}-soft text-${tone}`)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 font-reward text-2xl leading-none text-foreground">{value}</div>
      <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
