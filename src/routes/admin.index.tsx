import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Building2,
  Eye,
  GraduationCap,
  Plus,
  School as SchoolIcon,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  getSchools,
  getStudents,
  getTeachers,
  onAdminState,
  type School,
} from "@/lib/namma-admin";
import neoExplaining from "@/assets/characters/neo-explaining.png";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin dashboard · Namma AI" }] }),
  component: AdminDashboard,
});

const ACTIONS: {
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  to: "/admin/schools" | "/admin/teachers" | "/admin/students";
  primary?: boolean;
}[] = [
  { title: "Add School", sub: "Onboard a new school", icon: Building2, tone: "challenge", to: "/admin/schools", primary: true },
  { title: "Add Teachers", sub: "Create teacher accounts", icon: Users, tone: "explore", to: "/admin/teachers" },
  { title: "Add Students", sub: "Create student logins", icon: GraduationCap, tone: "story", to: "/admin/students" },
  { title: "View Schools", sub: "Manage participating schools", icon: SchoolIcon, tone: "bonus", to: "/admin/schools" },
];

function useAdminSnapshot() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => onAdminState(() => setTick((t) => t + 1)), []);
  return React.useMemo(
    () => ({
      schools: getSchools(),
      teachers: getTeachers(),
      students: getStudents(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  );
}

function AdminDashboard() {
  const { schools, teachers, students } = useAdminSnapshot();

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-challenge-soft via-white to-story-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-challenge/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-story/25 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-challenge/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
                <ShieldCheck className="h-3 w-3" /> Admin portal
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                Set up your{" "}
                <span className="bg-gradient-to-r from-challenge via-story to-reflect bg-clip-text text-transparent">
                  schools
                </span>{" "}
                for Phase 1.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Create schools, add teachers, and onboard students. Everything they need to start their weekly adventures lives right here.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="hero" size="lg">
                  <Link to="/admin/schools">
                    <Plus className="h-4 w-4" /> Add school
                  </Link>
                </Button>
                <Button asChild variant="soft" size="lg">
                  <Link to="/admin/schools">
                    <SchoolIcon className="h-4 w-4" /> View schools
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden h-64 items-end justify-center md:flex">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm" />
              <motion.img
                src={neoExplaining}
                alt="Neo"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-52 w-52 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
        </motion.section>

        {/* Quick metrics */}
        <section className="grid grid-cols-3 gap-3">
          <MetricCard tone="challenge" label="Schools" value={schools.length} icon={Building2} />
          <MetricCard tone="explore" label="Teachers" value={teachers.length} icon={Users} />
          <MetricCard tone="story" label="Students" value={students.length} icon={GraduationCap} />
        </section>

        {/* Four primary actions */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-5 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <div className={cn("pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-60", `bg-${a.tone}/40`)} />
                <span className={cn("relative flex h-11 w-11 items-center justify-center rounded-2xl", `bg-${a.tone}-soft text-${a.tone}`)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="relative mt-3 font-display text-base font-extrabold text-foreground">
                  {a.title}
                </div>
                <div className="relative mt-1 text-sm text-muted-foreground">{a.sub}</div>
                <Button asChild size="sm" variant={a.primary ? "hero" : "soft"} className="mt-4">
                  <Link to={a.to}>Open</Link>
                </Button>
              </motion.div>
            );
          })}
        </section>

        {/* Schools list */}
        <section className="section-panel">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">
                <Building2 className="h-3.5 w-3.5" /> Schools
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                Your participating schools
              </h2>
            </div>
            <Button asChild variant="hero" size="sm">
              <Link to="/admin/schools">
                <Plus className="h-4 w-4" /> Add school
              </Link>
            </Button>
          </div>

          {schools.length === 0 ? (
            <EmptySchools />
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {schools.map((s) => (
                <SchoolCardCompact key={s.school_id} school={s} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function MetricCard({
  tone,
  label,
  value,
  icon: Icon,
}: {
  tone: string;
  label: string;
  value: number;
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

function SchoolCardCompact({ school }: { school: School }) {
  const teachers = getTeachers(school.school_id).length;
  const students = getStudents(school.school_id).length;
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-foreground/5 bg-white/90 p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-extrabold text-foreground">{school.school_name}</div>
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {school.school_id}
          </div>
        </div>
        <span className="rounded-full bg-challenge-soft px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-challenge">
          Active
        </span>
      </div>
      <div className="mt-3 flex gap-3 text-sm">
        <span className="font-semibold text-foreground">{teachers}</span>
        <span className="text-muted-foreground">teachers</span>
        <span className="ml-2 font-semibold text-foreground">{students}</span>
        <span className="text-muted-foreground">students</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="soft">
          <Link to="/admin/teachers" search={{ school: school.school_id }}>
            <UserPlus className="h-3.5 w-3.5" /> Add teacher
          </Link>
        </Button>
        <Button asChild size="sm" variant="soft">
          <Link to="/admin/students" search={{ school: school.school_id }}>
            <UserPlus className="h-3.5 w-3.5" /> Add students
          </Link>
        </Button>
        <Button asChild size="sm" variant="hero">
          <Link to="/admin/schools/$schoolId" params={{ schoolId: school.school_id }}>
            <Eye className="h-3.5 w-3.5" /> View school
          </Link>
        </Button>
      </div>
    </div>
  );
}

function EmptySchools() {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-foreground/15 bg-white/70 p-8 text-center">
      <SchoolIcon className="mx-auto h-8 w-8 text-muted-foreground" />
      <div className="mt-3 font-display text-lg font-bold text-foreground">No schools yet</div>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Create your first school to start onboarding teachers and students.
      </p>
      <Button asChild variant="hero" size="sm" className="mt-4">
        <Link to="/admin/schools">
          <Plus className="h-4 w-4" /> Add school
        </Link>
      </Button>
    </div>
  );
}
