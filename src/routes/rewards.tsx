import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Crown,
  Download,
  Flame,
  Gem,
  Gift,
  Image as ImageIcon,
  Lock,
  Monitor,
  Package,
  PartyPopper,
  Smartphone,
  Sparkle,
  Sparkles,
  Star,
  Tablet,
  Trophy,
  Wand2,
  X,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase, fadeUp } from "@/components/namma/motion";
import { getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import { getTotalXP, getWeeklyStreak, onNammaState } from "@/lib/namma-progress";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";
import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards Vault · Namma AI" },
      {
        name: "description",
        content:
          "Your magical rewards vault — streak surprises, certificates, wallpapers, and cinematic celebration moments.",
      },
    ],
  }),
  component: RewardsPage,
});

/* -------------------------------------------------------------- */
/*                          DATA                                  */
/* -------------------------------------------------------------- */

// Dynamic streak + XP read in RewardsPage; these defaults are fallbacks.
const DEFAULT_STREAK = 0;
const DEFAULT_XP = 0;

type Tone = "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp" | "success";

const toneGradient: Record<Tone, string> = {
  story: "from-story/30 via-story/10 to-transparent",
  explore: "from-explore/30 via-explore/10 to-transparent",
  decide: "from-decide/30 via-decide/10 to-transparent",
  reflect: "from-reflect/30 via-reflect/10 to-transparent",
  challenge: "from-challenge/30 via-challenge/10 to-transparent",
  bonus: "from-bonus/30 via-bonus/10 to-transparent",
  xp: "from-xp/30 via-xp/10 to-transparent",
  success: "from-success/30 via-success/10 to-transparent",
};

const toneText: Record<Tone, string> = {
  story: "text-story",
  explore: "text-explore",
  decide: "text-decide",
  reflect: "text-reflect",
  challenge: "text-challenge",
  bonus: "text-bonus",
  xp: "text-xp",
  success: "text-success",
};

const toneRing: Record<Tone, string> = {
  story: "ring-story/40",
  explore: "ring-explore/40",
  decide: "ring-decide/40",
  reflect: "ring-reflect/40",
  challenge: "ring-challenge/40",
  bonus: "ring-bonus/40",
  xp: "ring-xp/40",
  success: "ring-success/40",
};

const toneBg: Record<Tone, string> = {
  story: "bg-story",
  explore: "bg-explore",
  decide: "bg-decide",
  reflect: "bg-reflect",
  challenge: "bg-challenge",
  bonus: "bg-bonus",
  xp: "bg-xp",
  success: "bg-success",
};

const toneSoft: Record<Tone, string> = {
  story: "bg-story-soft",
  explore: "bg-explore-soft",
  decide: "bg-decide-soft",
  reflect: "bg-reflect-soft",
  challenge: "bg-challenge-soft",
  bonus: "bg-bonus-soft",
  xp: "bg-xp-soft",
  success: "bg-success-soft",
};

/* -------------------------------------------------------------- */
/*                     STREAK MILESTONES                           */
/* -------------------------------------------------------------- */

type Streak = {
  weeks: number;
  title: string;
  reward: string;
  tone: Tone;
  message: string;
};

const STREAKS: Streak[] = [
  { weeks: 2, title: "Spark Lit", reward: "Neo Celebration Wallpaper", tone: "story", message: "Two weeks in. The spark is real." },
  { weeks: 4, title: "Steady Flame", reward: "Bonus 100 XP Burst", tone: "decide", message: "A whole month of weekly wins." },
  { weeks: 6, title: "Weekly Champion", reward: "AI Explorer Certificate", tone: "explore", message: "Six weeks of magical learning." },
  { weeks: 10, title: "Adventure Sage", reward: "Future Creator Frame", tone: "bonus", message: "Ten weeks of pure dedication." },
  { weeks: 18, title: "Mastermind", reward: "Holographic Avatar Aura", tone: "challenge", message: "You've built a real learning rhythm." },
  { weeks: 28, title: "Legendary", reward: "Legendary Streak Aura", tone: "xp", message: "Nearly a full course of brilliance." },
];

/* -------------------------------------------------------------- */
/*                     CELEBRATION MEMORIES                        */
/* -------------------------------------------------------------- */

type Memory = {
  id: string;
  title: string;
  caption: string;
  tone: Tone;
  character: "neo" | "dev" | "anaya";
  dialogue: string;
  unlocked: boolean;
};

const MEMORIES_BASE: Memory[] = [
  { id: "m1", title: "First Quiz Mastered", caption: "You aced your very first quiz.", tone: "decide", character: "dev", dialogue: "Logic level: rising fast. Well done!", unlocked: true },
  { id: "m2", title: "Week 1 Completed", caption: "Your adventure officially began.", tone: "story", character: "neo", dialogue: "You did it! Another adventure completed!", unlocked: true },
  { id: "m3", title: "6-Week Streak Achieved", caption: "Six weeks of magical learning.", tone: "explore", character: "anaya", dialogue: "Consistency makes creativity bloom.", unlocked: true },
  { id: "m4", title: "Ethics Champion", caption: "You made the wise choice.", tone: "reflect", character: "anaya", dialogue: "Kindness in code — beautifully done.", unlocked: false },
  { id: "m5", title: "Creative Spark", caption: "You built something one-of-a-kind.", tone: "bonus", character: "anaya", dialogue: "Creativity deserves rewards too!", unlocked: false },
  { id: "m6", title: "Speed Solver", caption: "Quick, sharp, brilliant.", tone: "challenge", character: "dev", dialogue: "You're leveling up fast!", unlocked: false },
];

/* -------------------------------------------------------------- */
/*                       CERTIFICATES                              */
/* -------------------------------------------------------------- */

type Cert = {
  id: string;
  title: string;
  rarity: "Common" | "Rare" | "Legendary";
  tone: Tone;
  unlocked: boolean;
  date?: string;
};

const CERTS: Cert[] = [
  { id: "c1", title: "AI Explorer Certificate", rarity: "Rare", tone: "explore", unlocked: true, date: "May 14, 2026" },
  { id: "c2", title: "Creative Thinker Award", rarity: "Rare", tone: "bonus", unlocked: true, date: "May 18, 2026" },
  { id: "c3", title: "Ethical Innovator", rarity: "Legendary", tone: "reflect", unlocked: false },
  { id: "c4", title: "Namma AI Future Builder", rarity: "Legendary", tone: "xp", unlocked: false },
];

/* -------------------------------------------------------------- */
/*                       WALLPAPERS                                */
/* -------------------------------------------------------------- */

type Wallpaper = {
  id: string;
  title: string;
  device: "Desktop" | "Tablet" | "Mobile";
  tone: Tone;
  unlocked: boolean;
};

const WALLS: Wallpaper[] = [
  { id: "w1", title: "Neo in the Neon City", device: "Desktop", tone: "story", unlocked: true },
  { id: "w2", title: "Anaya's Galaxy", device: "Tablet", tone: "bonus", unlocked: true },
  { id: "w3", title: "Dev's Logic Grid", device: "Mobile", tone: "decide", unlocked: true },
  { id: "w4", title: "Holographic Badge Wall", device: "Desktop", tone: "xp", unlocked: false },
  { id: "w5", title: "AI Galaxy at Dawn", device: "Tablet", tone: "explore", unlocked: false },
  { id: "w6", title: "Legendary Aura", device: "Mobile", tone: "challenge", unlocked: false },
];

/* -------------------------------------------------------------- */
/*                       MYSTERY CAPSULES                          */
/* -------------------------------------------------------------- */

type Capsule = {
  id: string;
  title: string;
  hint: string;
  tone: Tone;
  ready: boolean;
};

const CAPSULES: Capsule[] = [
  { id: "p1", title: "Neo's Mystery Capsule", hint: "A spark of wonder waits inside.", tone: "story", ready: true },
  { id: "p2", title: "Anaya's Creative Surprise", hint: "Something colorful is hiding here.", tone: "bonus", ready: true },
  { id: "p3", title: "Dev's Logic Reward", hint: "Solve more puzzles to unlock.", tone: "decide", ready: false },
];

/* -------------------------------------------------------------- */
/*                       XP MILESTONES                             */
/* -------------------------------------------------------------- */

const XP_TIERS = [
  { xp: 500, name: "Bronze Vault", reward: "Premium Wallpaper Pack", tone: "story" as Tone },
  { xp: 1000, name: "Silver Vault", reward: "Holographic Frame", tone: "explore" as Tone },
  { xp: 2500, name: "Gold Vault", reward: "Legendary Certificate", tone: "bonus" as Tone },
  { xp: 5000, name: "Platinum Vault", reward: "Cinematic Celebration Scene", tone: "challenge" as Tone },
  { xp: 10000, name: "Mythic Vault", reward: "Exclusive Avatar Aura", tone: "xp" as Tone },
];

/* -------------------------------------------------------------- */
/*                         PAGE                                   */
/* -------------------------------------------------------------- */

function RewardsPage() {
  const completed = getCompleted();
  const completedCount = ACTIVITY_ORDER.filter((s) => completed.includes(s)).length;
  const collectedCount = 3 + completedCount;


  const memories = React.useMemo<Memory[]>(() => {
    return MEMORIES_BASE.map((m, i) => ({
      ...m,
      unlocked: m.unlocked || i < completedCount,
    }));
  }, [completedCount]);

  const nextStreak = STREAKS.find((s) => s.weeks > CURRENT_STREAK) ?? STREAKS[STREAKS.length - 1];

  const [openMemory, setOpenMemory] = React.useState<Memory | null>(null);
  const [openedCapsules, setOpenedCapsules] = React.useState<Record<string, boolean>>({});

  return (
    <AppShell>
      <div className="namma-page space-y-12 pb-20">
        <Hero
          streak={CURRENT_STREAK}
          xp={TOTAL_XP}
          collected={collectedCount}
          nextLabel={nextStreak.reward}
          nextIn={nextStreak.weeks - CURRENT_STREAK}
        />

        <StreakSection current={CURRENT_STREAK} />

        <VaultSection memories={memories} onOpen={setOpenMemory} />

        <CertificateSection />

        <WallpaperSection />

        <CapsuleSection
          opened={openedCapsules}
          onOpen={(id) => setOpenedCapsules((p) => ({ ...p, [id]: true }))}
        />

        <XPMilestoneSection xp={TOTAL_XP} />

        <ClosingMoment />
      </div>

      <AnimatePresence>
        {openMemory && (
          <MemoryOverlay memory={openMemory} onClose={() => setOpenMemory(null)} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

/* -------------------------------------------------------------- */
/*                         HERO                                   */
/* -------------------------------------------------------------- */

function Hero({
  streak,
  xp,
  collected,
  nextLabel,
  nextIn,
}: {
  streak: number;
  xp: number;
  collected: number;
  nextLabel: string;
  nextIn: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: nammaEase }}
      className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br from-bonus-soft via-background to-explore-soft p-6 shadow-[0_30px_80px_-30px_rgba(120,80,200,0.45)] md:p-10"
    >
      {/* ambient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-bonus/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-explore/30 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_0)] [background-size:28px_28px]" />

      {/* floating particles */}
      <FloatingParticles />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-white/70 px-4 py-1.5 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-bonus" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-bonus">
              Your Rewards Vault
            </span>
          </motion.div>

          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              A vault full of{" "}
              <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
                magical surprises
              </span>
              .
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/75 md:text-lg">
              Every adventure completed unlocks magical surprises, celebrations, and collectible
              memories. Open them, share them, keep them forever.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <HeroStat icon={<Zap className="h-4 w-4" />} label="Total XP" value={xp.toLocaleString()} tone="xp" />
            <HeroStat icon={<Flame className="h-4 w-4" />} label="Weekly streak" value={`${streak}w`} tone="challenge" />
            <HeroStat icon={<Gift className="h-4 w-4" />} label="Collected" value={String(collected)} tone="bonus" />
            <HeroStat
              icon={<Package className="h-4 w-4" />}
              label="Next Unlock"
              value={nextIn > 0 ? `${nextIn}w` : "Ready!"}
              tone="explore"
              hint={nextLabel}
            />
          </div>
        </div>

        {/* vault scene */}
        <VaultScene />
      </div>
    </motion.section>
  );
}

function HeroStat({
  icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: Tone;
  hint?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-3 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]"
    >
      <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-50", toneBg[tone])} />
      <div className="relative flex items-center gap-3">
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1", toneText[tone], toneRing[tone], toneSoft[tone])}>
          {icon}
        </span>
        <div className="min-w-0 leading-tight">
          <div className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">{value}</div>
        </div>
      </div>
      {hint && (
        <div className="relative mt-2 truncate text-[0.66rem] font-semibold text-foreground/60">
          {hint}
        </div>
      )}
    </motion.div>
  );
}

function VaultScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* holographic ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border-2 border-dashed border-bonus/30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12 rounded-full border border-dashed border-explore/40"
      />

      {/* radial glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-bonus/40 via-white to-explore/40 blur-2xl" />

      {/* orbiting rewards */}
      {[
        { Icon: Trophy, tone: "xp" as Tone, x: "10%", y: "12%", delay: 0 },
        { Icon: Gem, tone: "bonus" as Tone, x: "82%", y: "20%", delay: 0.4 },
        { Icon: Star, tone: "challenge" as Tone, x: "88%", y: "70%", delay: 0.8 },
        { Icon: Crown, tone: "explore" as Tone, x: "8%", y: "72%", delay: 1.2 },
        { Icon: Sparkle, tone: "reflect" as Tone, x: "50%", y: "4%", delay: 1.6 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
          className="absolute"
          style={{ left: o.x, top: o.y }}
        >
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-lg ring-2", toneRing[o.tone], toneText[o.tone])}>
            <o.Icon className="h-5 w-5" />
          </div>
        </motion.div>
      ))}

      {/* Neo with vault */}
      <motion.img
        src={neoCelebrating}
        alt="Neo opening the rewards vault"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_20px_40px_rgba(120,80,200,0.45)]"
      />
    </div>
  );
}

function FloatingParticles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 6 + Math.random() * 6,
        size: 4 + Math.random() * 6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- */
/*                       SECTION HEADER                            */
/* -------------------------------------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tone = "bonus",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tone?: Tone;
}) {
  return (
    <motion.div {...fadeUp} className="space-y-2">
      <div className={cn("inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 backdrop-blur-md", toneRing[tone], toneText[tone])}>
        <Sparkles className="h-3 w-3" />
        <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em]">{eyebrow}</span>
      </div>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">{subtitle}</p>
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                    SECTION 1 — STREAK PATH                      */
/* -------------------------------------------------------------- */

function StreakSection({ current }: { current: number }) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Weekly Champion Rewards"
        title="Keep your weekly streak alive."
        subtitle="Finish every activity before the next week unlocks and collect cinematic surprises along the way."
        tone="challenge"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-challenge-soft via-background to-bonus-soft p-6 md:p-8">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-challenge/20 blur-[100px]" />

        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-challenge to-bonus text-white shadow-[0_10px_30px_-5px_rgba(255,120,80,0.55)]"
          >
            <Flame className="h-6 w-6" />
          </motion.div>
          <div>
            <div className="font-display text-2xl font-extrabold text-foreground">
              {current}-week streak
            </div>
            <div className="text-sm text-foreground/70">
              Complete this week before the next unlocks to grow your streak.
            </div>
          </div>
        </div>

        {/* path */}
        <div className="relative mt-8">
          {/* connecting rail */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-challenge/30 via-bonus/30 to-xp/30 md:block" />
          <div
            className="absolute left-0 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-challenge to-bonus md:block"
            style={{ width: `${Math.min(100, (current / 28) * 100)}%` }}
          />
          <div className="relative grid grid-cols-2 gap-4 md:grid-cols-6">
            {STREAKS.map((s) => {
              const state = current >= s.weeks ? "done" : current >= s.weeks - 2 ? "current" : "locked";
              return <StreakNode key={s.weeks} s={s} state={state} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StreakNode({ s, state }: { s: Streak; state: "done" | "current" | "locked" }) {
  const isDone = state === "done";
  const isCurrent = state === "current";
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative">
        {isCurrent && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", toneBg[s.tone])}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div
          className={cn(
            "relative flex h-16 w-16 items-center justify-center rounded-full border-2 backdrop-blur-md transition-all",
            isDone && cn("bg-gradient-to-br shadow-lg", toneGradient[s.tone], "border-white/80"),
            isCurrent && "border-dashed border-foreground/40 bg-white/80",
            state === "locked" && "border-border/60 bg-white/40"
          )}
        >
          {isDone ? (
            <Sparkle className={cn("h-6 w-6", toneText[s.tone])} />
          ) : state === "locked" ? (
            <Lock className="h-5 w-5 text-foreground/30" />
          ) : (
            <Flame className={cn("h-6 w-6", toneText[s.tone])} />
          )}
        </div>
      </div>
      <div className="mt-3 font-display text-sm font-extrabold text-foreground">
        {s.weeks} weeks
      </div>
      <div className={cn("text-[0.66rem] font-bold uppercase tracking-[0.14em]", isDone ? toneText[s.tone] : "text-muted-foreground")}>
        {s.title}
      </div>
      <div className="mt-1 max-w-[10rem] text-[0.7rem] leading-4 text-foreground/60">
        {s.reward}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                  SECTION 2 — CELEBRATION VAULT                  */
/* -------------------------------------------------------------- */

function VaultSection({
  memories,
  onOpen,
}: {
  memories: Memory[];
  onOpen: (m: Memory) => void;
}) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Celebration Vault"
        title="Your magical memories."
        subtitle="Each milestone you reach lives forever here. Tap a capsule to relive the moment."
        tone="bonus"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((m, i) => (
          <MemoryCard key={m.id} m={m} index={i} onOpen={() => m.unlocked && onOpen(m)} />
        ))}
      </div>
    </section>
  );
}

function MemoryCard({ m, index, onOpen }: { m: Memory; index: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: nammaEase }}
      whileHover={m.unlocked ? { y: -6 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 text-left backdrop-blur-md",
        m.unlocked
          ? cn("border-white/70 from-white/90 to-white/60 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)]", `hover:ring-2 ${toneRing[m.tone]}`)
          : "border-border/40 from-muted/30 to-background cursor-not-allowed"
      )}
    >
      {/* aura */}
      <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-60", toneBg[m.tone])} />

      {/* shine sweep */}
      {m.unlocked && (
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl ring-1",
            toneText[m.tone],
            toneRing[m.tone],
            m.unlocked ? "bg-white/80" : "bg-muted/50"
          )}
        >
          {m.unlocked ? <PartyPopper className="h-5 w-5" /> : <Lock className="h-5 w-5 text-foreground/40" />}
        </div>
        {m.unlocked && (
          <span className={cn("rounded-full border bg-white/70 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em]", toneRing[m.tone], toneText[m.tone])}>
            Unlocked
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <div className={cn("font-display text-lg font-extrabold", m.unlocked ? "text-foreground" : "text-foreground/40 blur-[1px]")}>
          {m.title}
        </div>
        <p className={cn("mt-1 text-sm leading-5", m.unlocked ? "text-foreground/70" : "text-foreground/30 blur-[1px]")}>
          {m.caption}
        </p>
      </div>

      {m.unlocked && (
        <div className="relative mt-4 inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-foreground/60">
          Tap to relive <Sparkles className="h-3 w-3" />
        </div>
      )}
    </motion.button>
  );
}

function MemoryOverlay({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const char =
    memory.character === "neo" ? neoCelebrating : memory.character === "dev" ? devCelebrating : anayaCelebrating;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br p-8 text-center shadow-2xl",
          toneGradient[memory.tone]
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-foreground/70 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* confetti */}
        {[...Array(20)].map((_, i) => (
          <motion.span
            key={i}
            className={cn("absolute h-2 w-2 rounded-full", toneBg[memory.tone])}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              opacity: 0,
            }}
            transition={{ duration: 1.4, delay: i * 0.03 }}
            style={{ left: "50%", top: "30%" }}
          />
        ))}

        <motion.img
          src={char}
          alt={memory.character}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-40 w-40 object-contain drop-shadow-2xl"
        />
        <div className={cn("mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.16em]", toneText[memory.tone])}>
          <Sparkles className="h-3 w-3" /> Celebration unlocked
        </div>
        <h3 className="mt-3 font-display text-2xl font-extrabold text-foreground">
          {memory.title}
        </h3>
        <p className="mt-2 text-sm text-foreground/70">{memory.caption}</p>
        <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4 text-sm italic text-foreground/80 backdrop-blur">
          "{memory.dialogue}"
        </div>
        <Button className="mt-5 rounded-full" onClick={onClose}>
          Keep adventuring <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                  SECTION 3 — CERTIFICATES                       */
/* -------------------------------------------------------------- */

function CertificateSection() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Printable Certificates"
        title="Awards you can frame."
        subtitle="Premium, magical, future-ready certificates — yours to download and proudly print."
        tone="explore"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {CERTS.map((c, i) => (
          <CertCard key={c.id} c={c} index={i} />
        ))}
      </div>
    </section>
  );
}

function CertCard({ c, index }: { c: Cert; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: nammaEase }}
      whileHover={c.unlocked ? { y: -6 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 backdrop-blur-md",
        c.unlocked
          ? cn("border-white/70 from-white/90 to-white/60 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] ring-1", toneRing[c.tone])
          : "border-border/50 from-muted/30 to-background"
      )}
    >
      {/* holographic shine */}
      {c.unlocked && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.6)_50%,transparent_60%)] [background-size:200%_200%] transition-all duration-700 [background-position:0%_0%] group-hover:[background-position:100%_100%]" />
          <div className={cn("absolute -top-16 -left-10 h-40 w-40 rounded-full blur-3xl opacity-50", toneBg[c.tone])} />
        </>
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl ring-1", toneText[c.tone], toneRing[c.tone], c.unlocked ? "bg-white/80" : "bg-muted/50")}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className={cn("font-display text-lg font-extrabold", c.unlocked ? "text-foreground" : "text-foreground/40")}>
              {c.title}
            </div>
            <div className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-foreground/60">
              {c.unlocked ? c.date : "Locked"}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em]",
            c.rarity === "Legendary"
              ? "border-xp/30 bg-xp-soft text-xp"
              : c.rarity === "Rare"
                ? "border-bonus/30 bg-bonus-soft text-bonus"
                : "border-border bg-muted text-foreground/70"
          )}
        >
          {c.rarity}
        </span>
      </div>

      {/* certificate preview */}
      <div className={cn("relative mt-5 aspect-[4/2.4] overflow-hidden rounded-2xl border bg-gradient-to-br p-4", toneGradient[c.tone], c.unlocked ? "border-white/60" : "border-border/40")}>
        {!c.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md">
            <Lock className="h-8 w-8 text-foreground/40" />
          </div>
        )}
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className={cn("text-[0.6rem] font-bold uppercase tracking-[0.2em]", toneText[c.tone])}>
            Namma AI
          </div>
          <div className="mt-1 font-display text-base font-extrabold text-foreground">
            Certificate of Achievement
          </div>
          <div className="mt-2 h-px w-24 bg-foreground/20" />
          <div className="mt-2 text-xs italic text-foreground/70">Awarded to Aarav K.</div>
          <Crown className={cn("mt-2 h-6 w-6", toneText[c.tone])} />
        </div>
      </div>

      {c.unlocked && (
        <div className="relative mt-4 flex items-center justify-between gap-2">
          <Button size="sm" variant="outline" className="rounded-full">
            Preview
          </Button>
          <Button size="sm" className="rounded-full">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download
          </Button>
        </div>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                  SECTION 4 — WALLPAPERS                         */
/* -------------------------------------------------------------- */

function WallpaperSection() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Wallpaper Collection"
        title="Make every screen magical."
        subtitle="Bring Neo, Anaya, and Dev to your desktop, tablet, and phone. New wallpapers unlock as you grow."
        tone="story"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WALLS.map((w, i) => (
          <WallpaperCard key={w.id} w={w} index={i} />
        ))}
      </div>
    </section>
  );
}

function WallpaperCard({ w, index }: { w: Wallpaper; index: number }) {
  const DeviceIcon = w.device === "Desktop" ? Monitor : w.device === "Tablet" ? Tablet : Smartphone;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: nammaEase }}
      whileHover={w.unlocked ? { y: -6 } : undefined}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white/70 backdrop-blur-md"
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-gradient-to-br", toneGradient[w.tone])}>
        {/* abstract scene */}
        <div className="absolute inset-0">
          <div className={cn("absolute -left-10 top-10 h-40 w-40 rounded-full blur-3xl opacity-70", toneBg[w.tone])} />
          <div className="absolute right-6 bottom-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] [background-size:18px_18px] opacity-30" />
          <ImageIcon className={cn("absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-50", toneText[w.tone])} />
        </div>

        {!w.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80">
              <Lock className="h-6 w-6 text-foreground/50" />
            </div>
          </div>
        )}

        {/* hover shine */}
        {w.unlocked && (
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        )}
      </div>

      <div className="flex items-center justify-between p-4">
        <div>
          <div className={cn("font-display text-sm font-extrabold", w.unlocked ? "text-foreground" : "text-foreground/50")}>
            {w.title}
          </div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-foreground/60">
            <DeviceIcon className="h-3 w-3" /> {w.device}
          </div>
        </div>
        {w.unlocked ? (
          <Button size="sm" variant="ghost" className="rounded-full">
            <Download className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-foreground/40">
            Locked
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                  SECTION 5 — MYSTERY CAPSULES                   */
/* -------------------------------------------------------------- */

function CapsuleSection({
  opened,
  onOpen,
}: {
  opened: Record<string, boolean>;
  onOpen: (id: string) => void;
}) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Mystery Capsules"
        title="Surprises waiting for you."
        subtitle="Glowing orbs hide hidden cards, character messages, and fun AI moments. Tap one to reveal."
        tone="reflect"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {CAPSULES.map((c, i) => (
          <CapsuleCard
            key={c.id}
            c={c}
            index={i}
            opened={!!opened[c.id]}
            onOpen={() => c.ready && onOpen(c.id)}
          />
        ))}
      </div>
    </section>
  );
}

function CapsuleCard({
  c,
  index,
  opened,
  onOpen,
}: {
  c: Capsule;
  index: number;
  opened: boolean;
  onOpen: () => void;
}) {
  const char =
    c.id === "p1" ? neoHappy : c.id === "p2" ? anayaHappy : devHappy;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: nammaEase }}
      whileHover={c.ready ? { y: -6, scale: 1.02 } : undefined}
      className={cn(
        "group relative flex aspect-[5/6] flex-col items-center justify-center overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 text-center",
        toneGradient[c.tone],
        c.ready ? "border-white/70 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.3)]" : "border-border/40 grayscale"
      )}
    >
      {/* orb */}
      <div className="relative">
        {c.ready && !opened && (
          <>
            <motion.div
              className={cn("absolute inset-0 rounded-full blur-2xl opacity-60", toneBg[c.tone])}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={cn("absolute inset-0 rounded-full border-2 border-dashed", toneRing[c.tone])}
            />
          </>
        )}
        <motion.div
          animate={opened ? { scale: [1, 1.15, 1] } : { y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br backdrop-blur-md",
            toneGradient[c.tone]
          )}
        >
          {opened ? (
            <img src={char} alt="" className="h-24 w-24 object-contain" />
          ) : c.ready ? (
            <Wand2 className={cn("h-10 w-10", toneText[c.tone])} />
          ) : (
            <Lock className="h-8 w-8 text-foreground/40" />
          )}
        </motion.div>
      </div>

      <div className="mt-5 font-display text-lg font-extrabold text-foreground">
        {c.title}
      </div>
      <p className="mt-1 max-w-[20ch] text-xs leading-5 text-foreground/70">
        {opened ? "You unlocked something special!" : c.hint}
      </p>

      {c.ready && (
        <span className={cn("mt-4 rounded-full bg-white/80 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] backdrop-blur", toneText[c.tone])}>
          {opened ? "Revealed" : "Tap to open"}
        </span>
      )}
    </motion.button>
  );
}

/* -------------------------------------------------------------- */
/*                  SECTION 6 — XP MILESTONES                      */
/* -------------------------------------------------------------- */

function XPMilestoneSection({ xp }: { xp: number }) {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="XP Milestone Rewards"
        title="Bigger XP. Bigger magic."
        subtitle="Hit milestone checkpoints to unlock the rarest items in the vault."
        tone="xp"
      />

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {XP_TIERS.map((t, i) => {
          const done = xp >= t.xp;
          const next = !done && xp >= (XP_TIERS[i - 1]?.xp ?? 0);
          return (
            <motion.div
              key={t.xp}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: nammaEase }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 text-center backdrop-blur-md",
                done
                  ? cn("border-white/70 shadow-lg ring-1", toneGradient[t.tone], toneRing[t.tone])
                  : "border-border/50 from-muted/30 to-background"
              )}
            >
              {done && (
                <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-60", toneBg[t.tone])} />
              )}
              <div
                className={cn(
                  "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1",
                  toneText[t.tone],
                  toneRing[t.tone],
                  done ? "bg-white/80" : "bg-muted/50"
                )}
              >
                {done ? <Trophy className="h-6 w-6" /> : <Lock className="h-5 w-5 text-foreground/40" />}
              </div>
              <div className={cn("mt-3 font-display text-xl font-extrabold", done ? "text-foreground" : "text-foreground/50")}>
                {t.xp.toLocaleString()} XP
              </div>
              <div className={cn("text-[0.66rem] font-bold uppercase tracking-[0.14em]", done ? toneText[t.tone] : "text-foreground/40")}>
                {t.name}
              </div>
              <div className={cn("mt-2 text-xs leading-5", done ? "text-foreground/70" : "text-foreground/40")}>
                {t.reward}
              </div>

              {next && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-foreground/70">
                  <Sparkles className="h-3 w-3" /> In progress
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- */
/*                       CLOSING MOMENT                            */
/* -------------------------------------------------------------- */

function ClosingMoment() {
  return (
    <motion.section
      {...fadeUp}
      className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br from-bonus-soft via-explore-soft to-challenge-soft p-8 md:p-12"
    >
      <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-bonus/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-explore/30 blur-[120px]" />
      <FloatingParticles />

      <div className="relative grid items-center gap-8 lg:grid-cols-3">
        <motion.img
          src={anayaCelebrating}
          alt="Anaya"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-48 w-48 object-contain drop-shadow-2xl lg:order-1"
        />
        <div className="text-center lg:col-span-1 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-white/70 px-3 py-1 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-bonus" />
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-bonus">
              A note from your guides
            </span>
          </div>
          <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground">
            Every step you take{" "}
            <span className="bg-gradient-to-r from-bonus via-challenge to-explore bg-clip-text text-transparent">
              writes a memory
            </span>
            .
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground/70">
            Keep learning, keep wondering — the vault grows with you.
          </p>
        </div>
        <motion.img
          src={devCelebrating}
          alt="Dev"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="mx-auto h-48 w-48 object-contain drop-shadow-2xl lg:order-3"
        />
      </div>
    </motion.section>
  );
}
