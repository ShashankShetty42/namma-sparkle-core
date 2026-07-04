import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, School,
  ShieldCheck, Users, GraduationCap, Target, FileSpreadsheet, Award, BarChart3,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { BrandMark } from "@/components/namma/brand-mark";
import { signIn, type UserRole } from "@/lib/namma-progress";
import { ROLE_HOME } from "@/lib/namma-roles";
import { DEMO_SCHOOL_ID, DEMO_SCHOOL_NAME, ensureDemoSeed } from "@/lib/namma-demo";

const searchSchema = z.object({
  role: z.enum(["student", "teacher", "principal", "admin"]).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [{ title: "Sign in · Namma AI · CT & AI Implementation Command Centre" }],
  }),
  component: LoginPage,
});

type RoleMeta = {
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const ROLE_META: Record<UserRole, RoleMeta> = {
  principal: {
    title: "Principal",
    tagline: "See implementation health across every grade.",
    icon: School,
    tone: "decide",
  },
  teacher: {
    title: "Teacher",
    tagline: "Plan the week, track workbook & projects, log observations.",
    icon: Users,
    tone: "explore",
  },
  student: {
    title: "Student",
    tagline: "Mark workbook check-ins and submit your CT & AI work.",
    icon: GraduationCap,
    tone: "success",
  },
  admin: {
    title: "Namma AI Admin",
    tagline: "Manage schools onboarded to the Command Centre.",
    icon: ShieldCheck,
    tone: "challenge",
  },
};

const HIGHLIGHTS = [
  { icon: Target,          label: "Implementation tracker across Grades 3–8" },
  { icon: BarChart3,       label: "Competency analytics & weekly trends" },
  { icon: FileSpreadsheet, label: "1,400+ evidence items · board-ready reports" },
  { icon: Award,           label: "Automated certificates with principal signature" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { role } = Route.useSearch();
  const activeRole: UserRole = role ?? "principal";
  const meta = ROLE_META[activeRole];

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [schoolCode, setSchoolCode] = React.useState(DEMO_SCHOOL_ID);
  const [showPw, setShowPw] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    // Prefill email per role for a smoother demo.
    setEmail(
      activeRole === "principal" ? "principal@nammavidya.edu.in" :
      activeRole === "teacher"   ? "ritu.malhotra@nammavidya.edu.in" :
      activeRole === "student"   ? "aarav.sharma@nammavidya.edu.in" :
                                   "admin@nammaai.in",
    );
  }, [activeRole]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password to continue.");
      return;
    }
    setBusy(true);
    ensureDemoSeed({ autoSignIn: false });
    signIn({
      role: activeRole,
      email,
      schoolCode: activeRole === "admin" ? undefined : schoolCode || DEMO_SCHOOL_ID,
    });
    setTimeout(() => {
      // Phase 1: silent sign-in — no toast
      navigate({ to: ROLE_HOME[activeRole] });
    }, 350);
  }

  function useDemo() {
    ensureDemoSeed({ autoSignIn: false });
    signIn({
      role: activeRole,
      email,
      schoolCode: activeRole === "admin" ? undefined : DEMO_SCHOOL_ID,
    });
    // Phase 1: silent demo entry — no toast
    navigate({ to: ROLE_HOME[activeRole] });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F4F6FB] via-white to-[#EEF1F7]">
      {/* Subtle blueprint grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-decide/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-bonus/15 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/welcome" className="inline-flex items-center gap-2.5">
          <BrandMark size={36} />
          <span className="font-display text-base font-extrabold tracking-tight text-foreground">
            Namma <span className="text-primary">AI</span>
            <span className="ml-1.5 hidden text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:inline">
              · Command Centre
            </span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="rounded-2xl">
          <Link to="/welcome"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl items-stretch gap-8 px-5 pb-12 md:grid-cols-[1.05fr_1fr] md:gap-10 md:px-8 md:py-6">
        {/* LEFT — Positioning */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: nammaEase }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-foreground/10 bg-white/70 p-8 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(30,50,120,0.28)]"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-decide/25 bg-decide/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-decide">
              <ShieldCheck className="h-3 w-3" /> CBSE · CT & AI · Grades 3–8
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] text-foreground md:text-[2.4rem]">
              The <span className="bg-gradient-to-r from-decide via-story to-bonus bg-clip-text text-transparent">Implementation Command Centre</span> for your school.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
              Track workbook, projects, teacher activity, evidence and certificates for the CBSE
              Computational Thinking &amp; AI curriculum — one live view, board-ready any day of the year.
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h.label} className="flex items-start gap-2 rounded-2xl border border-foreground/10 bg-white/80 p-3">
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-decide/10 text-decide">
                  <h.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-foreground md:text-[0.82rem]">{h.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3 text-[0.72rem] text-muted-foreground">
            Piloting with <strong className="font-bold text-foreground">{DEMO_SCHOOL_NAME}</strong> · Bengaluru · 14 teachers · 384 students · 1,482 evidence items.
          </div>
        </motion.section>

        {/* RIGHT — Auth card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: nammaEase }}
          className="rounded-[28px] border border-foreground/10 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(30,50,120,0.28)] md:p-8"
        >
          {/* Role picker */}
          <div className="grid grid-cols-4 gap-1 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-1">
            {(Object.keys(ROLE_META) as UserRole[]).map((r) => {
              const m = ROLE_META[r];
              const active = r === activeRole;
              const Icon = m.icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => navigate({ to: "/login", search: { role: r } })}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] transition",
                    active
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {m.title.split(" ")[0]}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Sign in as {meta.title}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{meta.tagline}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {activeRole !== "admin" && (
              <label className="block">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  School code
                </span>
                <div className="relative mt-1">
                  <School className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    placeholder="NAMMA-DEMO"
                    className="rounded-2xl pl-9"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </span>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl pl-9"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Password
              </span>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo1234"
                  className="rounded-2xl pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-foreground/5"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <Button type="submit" disabled={busy} className="mt-2 h-11 w-full rounded-2xl text-sm font-bold">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>

            <button
              type="button"
              onClick={useDemo}
              className="w-full rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-foreground/[0.05]"
            >
              Open live demo school · one click
            </button>

            <div className="flex items-center justify-between pt-2 text-[0.72rem] text-muted-foreground">
              <Link to="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
              <Link to="/signup" className="hover:text-foreground">New school? Onboard →</Link>
            </div>
          </form>
        </motion.section>
      </main>
    </div>
  );
}
