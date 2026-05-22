import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  Building2,
  GraduationCap,
  LineChart,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import neoExplaining from "@/assets/characters/neo-explaining.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard · Namma AI" }] }),
  component: AdminDashboard,
});

const METRICS = [
  { label: "Active schools", value: "42", tone: "challenge", icon: Building2 },
  { label: "Total students", value: "9,184", tone: "story", icon: GraduationCap },
  { label: "Weekly engagement", value: "88%", tone: "explore", icon: Activity },
  { label: "Badges issued", value: "21.4K", tone: "bonus", icon: Award },
];

const SECTIONS = [
  { title: "School management", sub: "Create, edit, archive schools", icon: Building2, tone: "challenge" },
  { title: "Teacher access", sub: "Invite & assign classrooms", icon: Users, tone: "explore" },
  { title: "Student enrollment", sub: "Bulk upload & invite links", icon: GraduationCap, tone: "story" },
  { title: "Usage analytics", sub: "Engagement & completion", icon: LineChart, tone: "reflect" },
  { title: "Weekly activation", sub: "Unlock & gate weekly content", icon: Sparkles, tone: "bonus" },
  { title: "Quarterly reports", sub: "Generate & share PDFs", icon: Award, tone: "decide" },
];

const TOP_SCHOOLS = [
  { name: "Greenfield Public · Bangalore", pct: 96 },
  { name: "Sunrise Academy · Pune", pct: 93 },
  { name: "Lotus International · Chennai", pct: 91 },
  { name: "Heritage School · Mumbai", pct: 88 },
  { name: "Silver Oaks · Hyderabad", pct: 85 },
];

function AdminDashboard() {
  return (
    <AppShell>
      <div className="shell-inner !gap-8">
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
                Your{" "}
                <span className="bg-gradient-to-r from-challenge via-story to-reflect bg-clip-text text-transparent">
                  learning universe
                </span>{" "}
                at a glance.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Manage every school, every teacher and every weekly unlock from one
                premium command center.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="hero" size="lg">
                  <School className="h-4 w-4" /> Add school
                </Button>
                <Button variant="soft" size="lg">
                  <Users className="h-4 w-4" /> Invite teachers
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

        {/* Metrics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-soft)]"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${m.tone}-soft text-${m.tone}`)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 font-reward text-2xl leading-none text-foreground">{m.value}</div>
                <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {m.label}
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Modules */}
        <section className="grid gap-4 md:grid-cols-3">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.title}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-5 text-left shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-float)]"
              >
                <div className={cn("pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-60", `bg-${s.tone}/40`)} />
                <span className={cn("relative flex h-11 w-11 items-center justify-center rounded-2xl", `bg-${s.tone}-soft text-${s.tone}`)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="relative mt-3 font-display text-base font-extrabold text-foreground">
                  {s.title}
                </div>
                <div className="relative mt-1 text-sm text-muted-foreground">{s.sub}</div>
              </motion.button>
            );
          })}
        </section>

        {/* Top schools */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-panel"
        >
          <div className="eyebrow">
            <Building2 className="h-3.5 w-3.5" /> Top performing schools · this quarter
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Leaderboard
          </h2>
          <ul className="mt-5 space-y-3">
            {TOP_SCHOOLS.map((s, i) => (
              <li key={s.name} className="flex items-center gap-3 rounded-2xl border border-foreground/5 bg-white/80 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-sm font-extrabold text-background">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="font-display text-sm font-bold text-foreground">{s.name}</div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-challenge via-story to-bonus"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
                <span className="font-reward text-lg text-foreground">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </AppShell>
  );
}
