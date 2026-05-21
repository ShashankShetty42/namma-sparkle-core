import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Flame,
  Gift,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import anayaHappy from "@/assets/characters/anaya-happy.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Namma AI" },
      {
        name: "description",
        content:
          "Your personal AI learning dashboard with missions, XP, badges, streaks, and character-led guidance from Neo, Dev and Anaya.",
      },
    ],
  }),
  component: DashboardPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Hero */}
        <motion.section {...fadeUp} className="hero-panel">
          <div className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5">
              <div className="eyebrow">
                <Sparkles className="h-4 w-4" />
                <span>App shell · Phase 2</span>
              </div>
              <h1 className="display-hero !text-3xl md:!text-5xl">
                Hi Aarav — your next adventure is ready.
              </h1>
              <p className="hero-copy">
                Continue your AI journey with playful missions, earn XP, and unlock badges. Neo,
                Dev, and Anaya are here to guide every step.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg">
                  Continue mission
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="xp" size="lg">
                  Claim daily XP
                </Button>
                <Link
                  to="/design-system"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30"
                  style={{ height: "52px", paddingInline: "1.5rem" }}
                >
                  View design system
                </Link>
              </div>
            </div>

            <div className="relative flex h-full min-h-[260px] items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-story/25 via-explore/20 to-bonus/25 blur-2xl" />
              <img
                src={neoCelebrating}
                alt="Neo celebrating"
                className="relative h-72 w-72 object-contain animate-[namma-float_5.5s_ease-in-out_infinite]"
              />
            </div>
          </div>
        </motion.section>

        {/* Quick stats */}
        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatTile icon={<Star className="h-5 w-5" />} tone="xp" label="Total XP" value="320" sub="+50 today" />
          <StatTile icon={<Flame className="h-5 w-5" />} tone="decide" label="Streak" value="5 days" sub="Keep it alive!" />
          <StatTile icon={<Trophy className="h-5 w-5" />} tone="bonus" label="Badges" value="12" sub="2 new this week" />
          <StatTile icon={<Rocket className="h-5 w-5" />} tone="challenge" label="Missions" value="3 active" sub="1 nearly done" />
        </motion.section>

        {/* Shell preview & character row */}
        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="section-panel">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-2">
                <div className="eyebrow">
                  <Compass className="h-4 w-4" />
                  <span>Shell preview</span>
                </div>
                <h2 className="section-title !text-2xl">
                  Premium navigation, ready to scale.
                </h2>
                <p className="section-copy !text-base">
                  Your sidebar, top bar, character guidance, and motion language are wired in. Full
                  dashboard content arrives in the next phase.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Sidebar", value: "Collapsible · animated", chip: "bg-story-soft text-story" },
                { label: "Top bar", value: "XP · streak · search", chip: "bg-explore-soft text-explore" },
                { label: "Motion", value: "Soft · cinematic", chip: "bg-reflect-soft text-reflect" },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]">
                  <div className={`tone-chip ${b.chip}`}>{b.label}</div>
                  <div className="mt-2 font-display text-lg font-bold text-foreground">{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-panel relative overflow-hidden">
            <div className="eyebrow">
              <Sparkles className="h-4 w-4" />
              <span>Your guides</span>
            </div>
            <h3 className="mt-2 font-display text-xl font-bold text-foreground">
              Neo, Dev & Anaya
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              They&apos;ll cheer you on across every screen.
            </p>
            <div className="mt-4 flex items-end justify-around gap-2">
              <img src={anayaHappy} alt="Anaya" className="h-24 w-24 object-contain animate-[namma-float_5s_ease-in-out_infinite]" />
              <img src={neoCelebrating} alt="Neo" className="h-28 w-28 object-contain animate-[namma-float_4.5s_ease-in-out_infinite] [animation-delay:-1s]" />
              <img src={devExplaining} alt="Dev" className="h-24 w-24 object-contain animate-[namma-float_5.5s_ease-in-out_infinite] [animation-delay:-2s]" />
            </div>
          </div>
        </motion.section>

        {/* Quick links */}
        <motion.section
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <QuickLink to="/missions" icon={<Rocket className="h-5 w-5" />} tone="challenge" title="Continue mission" sub="Mission 4 · 60% done" />
          <QuickLink to="/activities" icon={<Compass className="h-5 w-5" />} tone="decide" title="Today's activity" sub="Explore & Observe" />
          <QuickLink to="/rewards" icon={<Gift className="h-5 w-5" />} tone="reflect" title="Claim rewards" sub="+50 XP waiting" />
          <QuickLink to="/badges" icon={<Zap className="h-5 w-5" />} tone="bonus" title="Next badge" sub="2 missions to unlock" />
        </motion.section>
      </div>
    </AppShell>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "xp" | "decide" | "bonus" | "challenge";
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="stat-pill !p-4"
    >
      <span className={`stat-pill-icon bg-${tone}-soft text-${tone}`}>{icon}</span>
      <div className="leading-tight">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <div className="font-display text-xl font-bold text-foreground">{value}</div>
        <div className="text-[0.72rem] text-muted-foreground">{sub}</div>
      </div>
    </motion.div>
  );
}

function QuickLink({
  to,
  icon,
  title,
  sub,
  tone,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  tone: "challenge" | "decide" | "reflect" | "bonus";
}) {
  return (
    <Link
      to={to}
      className="group preview-card flex items-center gap-3 !p-4 transition-all hover:-translate-y-1"
    >
      <span className={`preview-icon !h-11 !w-11 bg-${tone}-soft text-${tone}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-bold text-foreground">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
