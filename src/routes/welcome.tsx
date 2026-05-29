import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { getAuth, type UserRole } from "@/lib/namma-progress";
import { BrandMark } from "@/components/namma/brand-mark";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome · Namma AI" },
      {
        name: "description",
        content:
          "Your AI adventure begins here. A magical AI learning world for students, teachers and schools across Grades 5–10.",
      },
      { property: "og:title", content: "Welcome to Namma AI" },
      {
        property: "og:description",
        content: "Learn. Play. Create with AI. A premium AI learning universe.",
      },
    ],
  }),
  component: WelcomePage,
});

const ROLES: Array<{
  id: UserRole;
  emoji: string;
  title: string;
  blurb: string;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "student",
    emoji: "🎓",
    title: "Student",
    blurb: "Step into your weekly AI adventure with Neo, Dev & Anaya.",
    tone: "story",
    icon: GraduationCap,
  },
  {
    id: "teacher",
    emoji: "🧑‍🏫",
    title: "Teacher",
    blurb: "Track class progress, streaks, and weekly engagement.",
    tone: "explore",
    icon: Users,
  },
  {
    id: "admin",
    emoji: "🛡️",
    title: "Admin",
    blurb: "Manage schools, teachers and the entire learning universe.",
    tone: "challenge",
    icon: ShieldCheck,
  },
];

function WelcomePage() {
  const navigate = useNavigate();

  // Already signed in? Send to the right home.
  React.useEffect(() => {
    const a = getAuth();
    if (a.isAuthed && a.role) {
      navigate({
        to: a.role === "teacher" ? "/teacher" : a.role === "admin" ? "/admin" : "/",
        replace: true,
      });
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-story-soft via-background to-explore-soft">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-bonus/25 blur-3xl" />
      <div className="pointer-events-none absolute -top-32 right-[-10rem] h-[26rem] w-[26rem] rounded-full bg-story/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-reflect/25 blur-3xl" />
      <FloatingParticles />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2.5">
          <BrandMark size={44} />
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Namma <span className="text-primary">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-2xl">
            <Link to="/login" search={{ role: undefined }}>
              Sign in
            </Link>
          </Button>


        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-8 md:grid-cols-[1.1fr_1fr] md:gap-12 md:px-8 md:py-14">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: nammaEase }}
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-bonus-soft px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-bonus">
            <Wand2 className="h-3.5 w-3.5" /> A magical AI learning universe
          </span>

          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.02] text-foreground sm:text-5xl md:text-6xl">
            Your{" "}
            <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
              AI adventure
            </span>{" "}
            begins here.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Namma AI transforms students into future-ready creators through weekly
            adventures, creativity, ethics, and innovation — with Neo, Dev and
            Anaya as your guides.
          </p>

          {/* Role picker */}
          <div className="space-y-3">
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Continue as
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {ROLES.map((r, i) => (
                <RoleCard key={r.id} role={r} delay={0.1 + i * 0.06} />
              ))}
            </div>
          </div>

          {/* trust strip */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-xp" /> Grades 5–10
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-decide" /> Weekly adventures
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Safe for schools
            </span>
          </div>
        </motion.div>

        {/* RIGHT — characters + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: nammaEase, delay: 0.15 }}
          className="relative hidden h-[34rem] md:block"
        >
          <div className="absolute inset-6 rounded-[44px] border border-white/60 bg-gradient-to-br from-white/70 via-white/40 to-white/20 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(80,40,180,0.45)]" />
          <div className="absolute inset-10 rounded-[36px] bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.06_300/.7),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.95_0.05_190/.7),transparent_60%)]" />

          {/* characters */}
          <motion.img
            src={devHappy}
            alt="Dev"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-12 left-8 h-40 w-40 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
          />
          <motion.img
            src={neoCelebrating}
            alt="Neo"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="absolute bottom-4 left-1/2 h-64 w-64 -translate-x-1/2 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_30px_40px_rgba(0,0,0,0.22)]"
          />
          <motion.img
            src={anayaHappy}
            alt="Anaya"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-12 right-8 h-40 w-40 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]"
          />

          {/* floating cards */}
          <FloatingCard
            className="left-2 top-6"
            tone="story"
            icon={<Sparkles className="h-4 w-4" />}
            title="Week 9 unlocked"
            sub="Continue your journey"
            delay={0.9}
          />
          <FloatingCard
            className="right-2 top-12"
            tone="xp"
            icon={<Star className="h-4 w-4" />}
            title="+150 XP"
            sub="Quiz champion"
            delay={1.05}
          />
          <FloatingCard
            className="right-6 bottom-32"
            tone="bonus"
            icon={<Wand2 className="h-4 w-4" />}
            title="Future Innovator"
            sub="Expert badge earned"
            delay={1.2}
          />

          {/* speech bubble */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute left-1/2 top-2 -translate-x-1/2 rounded-2xl border border-white bg-white/95 px-4 py-2 text-sm font-bold text-foreground shadow-[var(--shadow-soft)]"
          >
            <span className="text-story">Neo:</span> Ready to fly? ✨
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 mx-auto max-w-7xl px-5 pb-6 text-center text-xs text-muted-foreground md:px-8">
        Built for the next generation of creators · © Namma AI
      </footer>
    </div>
  );
}

/* ───────── pieces ───────── */

function RoleCard({
  role,
  delay,
}: {
  role: (typeof ROLES)[number];
  delay: number;
}) {
  const Icon = role.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: nammaEase }}
    >
      <Link
        to="/login"
        search={{ role: role.id }}
        className={cn(
          "group relative block overflow-hidden rounded-3xl border-2 border-white/80 bg-white/85 p-4 text-left transition-all",
          "hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[var(--shadow-float)]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-60 transition-opacity group-hover:opacity-100",
            `bg-${role.tone}/40`,
          )}
        />
        <div
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-2xl text-lg shadow-[var(--shadow-soft)]",
            `bg-${role.tone}/15 text-${role.tone}`,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="relative mt-3 font-display text-base font-extrabold text-foreground">
          {role.emoji} {role.title}
        </div>
        <div className="relative mt-1 text-[0.78rem] leading-snug text-muted-foreground">
          {role.blurb}
        </div>
        <div
          className={cn(
            "relative mt-3 inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] transition-transform group-hover:translate-x-0.5",
            `text-${role.tone}`,
          )}
        >
          Continue <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}

function FloatingCard({
  className,
  tone,
  icon,
  title,
  sub,
  delay,
}: {
  className?: string;
  tone: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: nammaEase }}
      className={cn(
        "absolute flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 shadow-[var(--shadow-float)] backdrop-blur",
        "animate-[namma-float_5s_ease-in-out_infinite]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          `bg-${tone}-soft text-${tone}`,
        )}
      >
        {icon}
      </span>
      <div className="text-left leading-tight">
        <div className="font-display text-sm font-extrabold text-foreground">
          {title}
        </div>
        <div className="text-[0.7rem] text-muted-foreground">{sub}</div>
      </div>
    </motion.div>
  );
}

function FloatingParticles() {
  // Stable, deterministic positions for SSR safety
  const dots = Array.from({ length: 18 }, (_, i) => ({
    left: ((i * 53) % 100) + "%",
    top: ((i * 37 + 11) % 100) + "%",
    delay: (i % 6) * 0.4,
    size: 4 + (i % 4) * 2,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-bonus to-challenge opacity-50"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          animate={{ y: [0, -22, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
