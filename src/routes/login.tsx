import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  School,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { BrandMark } from "@/components/namma/brand-mark";
import { DEFAULT_PROFILE, getProfile, hasStudentOnboarded, labelToBand, saveProfile, signIn, type UserRole } from "@/lib/namma-progress";

import { getStudents, getTeachers } from "@/lib/namma-admin";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

const searchSchema = z.object({
  role: z.enum(["student", "teacher", "principal", "admin"]).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [{ title: "Sign in · Namma AI" }],
  }),
  component: LoginPage,
});

const ROLE_META: Record<
  UserRole,
  {
    title: string;
    emoji: string;
    tone: string;
    accent: string;
    icon: React.ComponentType<{ className?: string }>;
    blurb: string;
  }
> = {
  student: {
    title: "Student",
    emoji: "🎓",
    tone: "story",
    accent: "from-story via-reflect to-decide",
    icon: GraduationCap,
    blurb: "Your weekly adventure awaits.",
  },
  teacher: {
    title: "Teacher",
    emoji: "🧑‍🏫",
    tone: "explore",
    accent: "from-explore via-decide to-bonus",
    icon: Users,
    blurb: "Plan, track and support every class.",
  },
  principal: {
    title: "Principal",
    emoji: "🏫",
    tone: "bonus",
    accent: "from-bonus via-challenge to-reflect",
    icon: School,
    blurb: "See implementation across your school.",
  },
  admin: {
    title: "Admin",
    emoji: "🛡️",
    tone: "challenge",
    accent: "from-challenge via-story to-reflect",
    icon: ShieldCheck,
    blurb: "Manage schools across the platform.",
  },
};

function LoginPage() {
  const navigate = useNavigate();
  const { role } = Route.useSearch();
  const activeRole: UserRole = role ?? "student";
  const meta = ROLE_META[activeRole];

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [schoolCode, setSchoolCode] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [portal, setPortal] = React.useState(false);

  const profile = React.useMemo(() => getProfile(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in your email and password");
      return;
    }

    const identifier = email.trim();
    const pwd = password.trim();
    const code = schoolCode.trim();

    // Validate against admin-created accounts
    if (activeRole === "student") {
      if (!code) {
        toast.error("Please enter your school code");
        return;
      }
      const match = getStudents(code).find(
        (s) =>
          s.password === pwd &&
          (s.student_id.toLowerCase() === identifier.toLowerCase() ||
            s.student_name.toLowerCase() === identifier.toLowerCase()),
      );
      if (!match) {
        toast.error("Invalid student credentials. Ask your admin to create your account.");
        return;
      }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      const alreadyOnboarded = hasStudentOnboarded(code, match.student_id);
      // Reset profile to admin-set identity on every login; preserve onboarded state per-student.
      saveProfile({
        ...DEFAULT_PROFILE,
        name: match.student_name,
        gradeLabel: match.grade,
        gradeBand: labelToBand(match.grade),
        onboarded: alreadyOnboarded,
      });
      signIn({ role: "student", email: match.student_id, schoolCode: code });
      setLoading(false);
      setPortal(true);
      window.setTimeout(() => navigate({ to: "/", replace: true }), 1600);
      return;
    }


    if (activeRole === "teacher") {
      const match = getTeachers(code || undefined).find(
        (t) =>
          t.password === pwd &&
          t.teacher_email.toLowerCase() === identifier.toLowerCase(),
      );
      if (!match) {
        toast.error("Invalid teacher credentials. Ask your admin to create your account.");
        return;
      }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      signIn({ role: "teacher", email: match.teacher_email, schoolCode: match.school_id });
      setLoading(false);
      toast.success(`Welcome back, ${match.teacher_name}!`);
      navigate({ to: "/teacher", replace: true });
      return;
    }

    if (activeRole === "principal") {
      // Phase 1 demo: any principal with a school code signs in.
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      signIn({ role: "principal", email: identifier, schoolCode: code || undefined });
      setLoading(false);
      toast.success("Welcome back, Principal!");
      navigate({ to: "/principal", replace: true });
      return;
    }

    // Admin — bootstrapped account (not created via UI)
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    signIn({ role: "admin", email: identifier, schoolCode: code || undefined });
    setLoading(false);
    toast.success("Welcome back, Admin!");
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-story-soft via-background to-explore-soft">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-bonus/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-reflect/25 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/welcome" className="inline-flex items-center gap-2.5">
          <BrandMark size={40} />
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Namma <span className="text-primary">AI</span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="rounded-2xl">
          <Link to="/welcome">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl items-stretch gap-8 px-5 py-6 md:grid-cols-[1fr_1fr] md:gap-10 md:px-8 md:py-10">
        {/* LEFT — welcome side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative hidden flex-col justify-between overflow-hidden rounded-[36px] border border-white/70 bg-white/60 p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(80,40,180,0.35)] md:flex"
        >
          <div
            className={cn(
              "pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-60",
              `bg-${meta.tone}/40`,
            )}
          />
          <div className="relative space-y-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em]",
                `border-${meta.tone}/30 bg-${meta.tone}-soft text-${meta.tone}`,
              )}
            >
              <meta.icon className="h-3.5 w-3.5" /> {meta.title} portal
            </span>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              {activeRole === "student" ? (
                <>
                  Welcome back,{" "}
                  <span
                    className={cn(
                      "bg-gradient-to-r bg-clip-text text-transparent",
                      meta.accent,
                    )}
                  >
                    {profile.name}
                  </span>{" "}
                  — your Week 9 adventure awaits.
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      "bg-gradient-to-r bg-clip-text text-transparent",
                      meta.accent,
                    )}
                  >
                    {meta.blurb}
                  </span>
                </>
              )}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {activeRole === "student"
                ? "Pick up where you left off. Neo, Dev and Anaya are waiting in your weekly mission."
                : activeRole === "teacher"
                ? "See class completion, weekly streaks, and student creativity at a glance."
                : "Manage schools, teachers, and weekly content across your learning universe."}
            </p>
          </div>

          {/* Preview card */}
          {activeRole === "student" ? (
            <div className="relative mt-6">
              <div className="relative grid grid-cols-3 gap-2.5 rounded-3xl border border-white/80 bg-white/85 p-3 shadow-[var(--shadow-soft)]">
                <StatPreview icon={<Star className="h-4 w-4" />} tone="xp" label="XP" value="1,620" />
                <StatPreview icon={<Flame className="h-4 w-4" />} tone="decide" label="Streak" value="5w" />
                <StatPreview icon={<Sparkles className="h-4 w-4" />} tone="bonus" label="Badges" value="12" />
              </div>
              <CharacterCluster />
            </div>
          ) : (
            <CharacterCluster compact />
          )}
        </motion.div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: nammaEase, delay: 0.05 }}
          className="relative flex flex-col justify-center overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(80,40,180,0.35)] md:p-9"
        >
          {/* Role switcher */}
          <div className="mb-5 inline-flex rounded-full border border-foreground/10 bg-muted/40 p-1 text-xs">
            {(Object.keys(ROLE_META) as UserRole[]).map((r) => {
              const M = ROLE_META[r];
              const active = activeRole === r;
              return (
                <Link
                  key={r}
                  to="/login"
                  search={{ role: r }}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-bold transition-all",
                    active
                      ? `bg-${M.tone} text-white shadow-[var(--shadow-soft)]`
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {M.emoji} {M.title}
                </Link>
              );
            })}
          </div>

          <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Sign in to your {meta.title.toLowerCase()} portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/signup"
              className={cn("font-bold underline-offset-4 hover:underline", `text-${meta.tone}`)}
            >
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {(activeRole === "student" || activeRole === "teacher" || activeRole === "principal") && (
              <Field
                icon={<School className="h-4 w-4" />}
                label={activeRole === "student" ? "School code" : "School access code"}
              >
                <Input
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  placeholder="e.g. NAMMA-1042"
                  className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50"
                />
              </Field>
            )}

            <Field
              icon={<Mail className="h-4 w-4" />}
              label={
                activeRole === "student"
                  ? "Student ID or email"
                  : activeRole === "teacher"
                  ? "School email"
                  : "Admin email"
              }
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.com"
                autoComplete="email"
                className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50"
              />
            </Field>

            <Field icon={<Lock className="h-4 w-4" />} label="Password">
              <Input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 pr-10 text-sm font-semibold focus-visible:border-foreground/50"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Field>

            {activeRole === "admin" && (
              <Field icon={<ShieldCheck className="h-4 w-4" />} label="Security code">
                <Input
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  placeholder="6-digit code"
                  className="h-12 rounded-2xl border-2 border-foreground/10 bg-white pl-10 text-sm font-semibold focus-visible:border-foreground/50"
                />
              </Field>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-foreground/80">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-foreground/30 accent-foreground"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-bold text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={loading}
              className={cn(
                "mt-2 w-full rounded-2xl bg-gradient-to-r text-white shadow-[var(--shadow-glow)]",
                meta.accent,
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Continue as {meta.title} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-[0.7rem] text-muted-foreground">
            By continuing you agree to Namma AI&apos;s terms & privacy.
          </p>
        </motion.div>
      </main>

      {/* Magical portal transition (student only) */}
      <AnimatePresence>
        {portal && <PortalOverlay name={profile.name} />}
      </AnimatePresence>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}

function StatPreview({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/5 bg-white/90 p-3 text-center">
      <span
        className={cn(
          "mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-xl",
          `bg-${tone}-soft text-${tone}`,
        )}
      >
        {icon}
      </span>
      <div className="font-reward text-base leading-none text-foreground">{value}</div>
      <div className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function CharacterCluster({ compact = false }: { compact?: boolean }) {
  const size = compact ? "h-28 w-28" : "h-32 w-32";
  return (
    <div className={cn("relative flex items-end justify-center gap-1", compact ? "mt-2" : "mt-4")}>
      <img
        src={devHappy}
        alt="Dev"
        className={cn(size, "object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_28px_rgba(0,0,0,0.18)]")}
      />
      <img
        src={neoExplaining}
        alt="Neo"
        className={cn(compact ? "h-32 w-32" : "h-40 w-40", "object-contain animate-[namma-float_4.8s_ease-in-out_infinite] drop-shadow-[0_22px_28px_rgba(0,0,0,0.2)]")}
      />
      <img
        src={anayaHappy}
        alt="Anaya"
        className={cn(size, "object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_28px_rgba(0,0,0,0.18)]")}
      />
    </div>
  );
}

function PortalOverlay({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-bonus"
            style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37 + 11) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0.6, 1.4, 0.6] }}
            transition={{ duration: 1.4 + (i % 5) * 0.2, repeat: Infinity, delay: (i % 6) * 0.1 }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.1, 1], opacity: 1, rotate: [0, 90] }}
          transition={{ duration: 1.4, ease: nammaEase }}
          className="relative flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-bonus via-challenge to-explore shadow-[0_0_80px_rgba(180,120,255,0.6)]"
        >
          <div className="absolute inset-3 rounded-full border-2 border-white/40" />
          <div className="absolute inset-6 rounded-full border border-white/30" />
          <img
            src={neoExplaining}
            alt="Neo"
            className="relative h-32 w-32 object-contain animate-[namma-float_3s_ease-in-out_infinite]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center text-white backdrop-blur-md"
        >
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/70">
            Neo says
          </div>
          <div className="mt-1 font-display text-xl font-extrabold">
            Preparing your adventure, {name}…
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
