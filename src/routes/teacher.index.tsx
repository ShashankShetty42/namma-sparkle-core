import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  Download,
  Flame,
  GraduationCap,
  Mail,
  Printer,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import devExplaining from "@/assets/characters/dev-explaining.png";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Teacher dashboard · Namma AI" }] }),
  component: TeacherDashboard,
});

const CLASS_OVERVIEW = [
  { label: "Class completion", value: "91%", tone: "success", icon: Trophy, sub: "Week 9 · 8A" },
  { label: "Active streaks", value: "27/30", tone: "decide", icon: Flame, sub: "5+ weeks" },
  { label: "Badges earned", value: "184", tone: "bonus", icon: Award, sub: "+22 this week" },
  { label: "Avg engagement", value: "4.6/5", tone: "explore", icon: BarChart3, sub: "↑ 0.4 vs last wk" },
];

const STUDENTS = [
  { name: "Aarav K.", grade: "8A", week: 92, streak: 5, badges: 12, last: "Wk 9", tier: "Advanced" },
  { name: "Meera P.", grade: "8A", week: 98, streak: 7, badges: 15, last: "Wk 9", tier: "Expert" },
  { name: "Kabir S.", grade: "8A", week: 84, streak: 4, badges: 9, last: "Wk 9", tier: "Advanced" },
  { name: "Diya R.", grade: "8A", week: 76, streak: 3, badges: 8, last: "Wk 8", tier: "—" },
  { name: "Ishaan V.", grade: "8A", week: 88, streak: 6, badges: 11, last: "Wk 9", tier: "Advanced" },
];

const INSIGHTS = [
  "Aarav consistently completes weekly adventures before unlock deadlines.",
  "Riya excels in ethical reasoning activities.",
  "Class 8A has a 91% completion streak this quarter.",
];

function TeacherDashboard() {
  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-explore-soft via-white to-reflect-soft p-6 shadow-[var(--shadow-float)] md:p-10"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-explore/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-reflect/25 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-explore/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
                <Users className="h-3 w-3" /> Teacher portal · Class 8A
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-5xl">
                Your class is{" "}
                <span className="bg-gradient-to-r from-explore via-reflect to-decide bg-clip-text text-transparent">
                  on a magical run.
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                91% of Class 8A completed Week 9 ahead of unlock. Track every student&apos;s
                journey, streaks and badges — and share progress with parents in one click.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="hero" size="lg" onClick={() => toast.success("Generating quarterly PDF…")}>
                  <Download className="h-4 w-4" /> Generate quarterly report
                </Button>
                <Button variant="soft" size="lg" onClick={() => toast("Send to Parent flow opens here")}>
                  <Mail className="h-4 w-4" /> Send to parents
                </Button>
              </div>
            </div>
            <div className="relative hidden h-64 items-end justify-center md:flex">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm" />
              <motion.img
                src={devExplaining}
                alt="Dev"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-52 w-52 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
              />
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-2xl border border-white bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-[var(--shadow-soft)]"
              >
                <span className="text-explore">Dev:</span> 27 students on streak!
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Overview tiles */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CLASS_OVERVIEW.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow-soft)]"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${s.tone}-soft text-${s.tone}`)}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 font-reward text-2xl leading-none text-foreground">{s.value}</div>
                <div className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
              </motion.div>
            );
          })}
        </section>

        {/* Student table */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-panel relative overflow-hidden"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="eyebrow">
                <GraduationCap className="h-3.5 w-3.5" /> Student progress
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                Class 8A · Week 9
              </h2>
            </div>
            <Button variant="soft" size="sm" onClick={() => toast.success("CSV export started")}>
              <Printer className="h-4 w-4" /> Export
            </Button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-foreground/5 bg-white/80">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Weekly</th>
                  <th className="p-3 text-left">Streak</th>
                  <th className="p-3 text-left">Badges</th>
                  <th className="p-3 text-left">Last active</th>
                  <th className="p-3 text-left">Tier</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s) => (
                  <tr key={s.name} className="border-t border-foreground/5">
                    <td className="p-3 font-display font-bold text-foreground">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.grade}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary/70">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-explore to-bonus"
                            style={{ width: `${s.week}%` }}
                          />
                        </div>
                        <span className="font-bold text-foreground">{s.week}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-decide-soft px-2 py-0.5 text-xs font-bold text-decide">
                        <Flame className="h-3 w-3" /> {s.streak}w
                      </span>
                    </td>
                    <td className="p-3 font-bold text-foreground">{s.badges}</td>
                    <td className="p-3 text-muted-foreground">{s.last}</td>
                    <td className="p-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-bold", s.tier === "Expert" ? "bg-bonus-soft text-bonus" : s.tier === "Advanced" ? "bg-challenge-soft text-challenge" : "bg-muted text-muted-foreground")}>
                        {s.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Insights */}
        <section className="grid gap-4 md:grid-cols-3">
          {INSIGHTS.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-[24px] border border-white/70 bg-gradient-to-br from-white via-white to-explore-soft/50 p-5 shadow-[var(--shadow-soft)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-bonus-soft text-bonus">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="mt-3 font-display text-sm font-bold leading-snug text-foreground">{line}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
