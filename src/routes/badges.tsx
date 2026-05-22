import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass as CompassIcon,
  Crown,
  Flame,
  Lock,
  Sparkles,
  Star,
  Trophy,
  Sparkle,
  Gem,
  Shield,
  Wand2,
  Rocket,
  Brain,
  Eye,
  Heart,
  Lightbulb,
  Globe,
  Bot,
  Cpu,
  Atom,
  Infinity as InfinityIcon,
  Award,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import {
  getCompletedWeeks,
  getEarnedBadges,
  getTotalXP,
  getWeeklyStreak,
  onNammaState,
} from "@/lib/namma-progress";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import devHappy from "@/assets/characters/dev-happy.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Trophy Vault · Namma AI" },
      {
        name: "description",
        content:
          "Your AI Trophy Vault — collect 35 magical badges across five worlds on your Namma AI adventure.",
      },
    ],
  }),
  component: BadgesPage,
});

/* -------------------------------------------------------------- */
/*                       BADGE UNIVERSE DATA                       */
/* -------------------------------------------------------------- */

type WorldKey = "explorer" | "creator" | "ethics" | "master" | "legend";
type IconKey =
  | "spark" | "compass" | "lightbulb" | "wand" | "brain" | "eye" | "rocket"
  | "heart" | "gem" | "bot" | "cpu" | "globe" | "atom" | "shield" | "star"
  | "trophy" | "infinity" | "crown" | "award" | "sparkle" | "sparkles";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  spark: Sparkle, compass: CompassIcon, lightbulb: Lightbulb, wand: Wand2,
  brain: Brain, eye: Eye, rocket: Rocket, heart: Heart, gem: Gem, bot: Bot,
  cpu: Cpu, globe: Globe, atom: Atom, shield: Shield, star: Star, trophy: Trophy,
  infinity: InfinityIcon, crown: Crown, award: Award, sparkle: Sparkle, sparkles: Sparkles,
};

type Badge = {
  week: number;
  name: string;
  lore: string;
  xp: number;
  icon: IconKey;
};

type World = {
  key: WorldKey;
  romanNum: string;
  name: string;
  tagline: string;
  weekRange: string;
  guide: "neo" | "dev" | "anaya";
  gradient: string; // tailwind gradient classes
  ring: string;     // tailwind border/ring color
  glow: string;     // tailwind bg blur color
  chip: string;     // tailwind chip text/bg
  badges: Badge[];
};

const WORLDS: World[] = [
  {
    key: "explorer",
    romanNum: "I",
    name: "AI Explorer Beginnings",
    tagline: "Where every great adventurer starts — with one curious question.",
    weekRange: "Weeks 1 – 7",
    guide: "neo",
    gradient: "from-story/85 via-explore/70 to-bonus/80",
    ring: "border-story/40",
    glow: "bg-story/35",
    chip: "bg-story/15 text-story",
    badges: [
      { week: 1, name: "Spark Seeker", lore: "Lit the first spark of AI curiosity.", xp: 120, icon: "spark" },
      { week: 2, name: "Curious Pathfinder", lore: "Walked into the unknown with bright eyes.", xp: 130, icon: "compass" },
      { week: 3, name: "Idea Igniter", lore: "Turned a tiny thought into a glowing idea.", xp: 140, icon: "lightbulb" },
      { week: 4, name: "Prompt Pioneer", lore: "Spoke to a machine and made it listen.", xp: 150, icon: "wand" },
      { week: 5, name: "Logic Explorer", lore: "Mapped the secret rivers of reasoning.", xp: 160, icon: "brain" },
      { week: 6, name: "Future Observer", lore: "Saw tomorrow inside today's data.", xp: 170, icon: "eye" },
      { week: 7, name: "AI Adventurer", lore: "Earned the first true Explorer crest.", xp: 200, icon: "rocket" },
    ],
  },
  {
    key: "creator",
    romanNum: "II",
    name: "Creator's Lab",
    tagline: "Imagination on, lab coats glowing — let's build with AI.",
    weekRange: "Weeks 8 – 14",
    guide: "anaya",
    gradient: "from-reflect/80 via-explore/70 to-story/80",
    ring: "border-reflect/40",
    glow: "bg-reflect/35",
    chip: "bg-reflect/15 text-reflect",
    badges: [
      { week: 8, name: "Dream Designer", lore: "Sketched a dream the world had not seen.", xp: 180, icon: "heart" },
      { week: 9, name: "Story Architect", lore: "Built worlds from words and wonder.", xp: 200, icon: "gem" },
      { week: 10, name: "Vision Builder", lore: "Gave a machine its very first sight.", xp: 200, icon: "eye" },
      { week: 11, name: "Creative Coder", lore: "Whispered to code — and it sang back.", xp: 210, icon: "bot" },
      { week: 12, name: "Innovation Maker", lore: "Made the impossible move one step closer.", xp: 220, icon: "wand" },
      { week: 13, name: "Digital Creator", lore: "Shaped pixels into stories.", xp: 220, icon: "sparkle" },
      { week: 14, name: "Imagination Master", lore: "Crowned for limitless thinking.", xp: 250, icon: "crown" },
    ],
  },
  {
    key: "ethics",
    romanNum: "III",
    name: "Ethics & Wisdom Realm",
    tagline: "The bravest heroes ask the hardest questions.",
    weekRange: "Weeks 15 – 21",
    guide: "dev",
    gradient: "from-challenge/85 via-explore/60 to-decide/70",
    ring: "border-challenge/40",
    glow: "bg-challenge/35",
    chip: "bg-challenge/15 text-challenge",
    badges: [
      { week: 15, name: "Truth Guardian", lore: "Keeper of facts in a noisy world.", xp: 220, icon: "shield" },
      { week: 16, name: "Fairness Keeper", lore: "Held the scales steady for everyone.", xp: 230, icon: "heart" },
      { week: 17, name: "Privacy Protector", lore: "Guarded the doors of personal data.", xp: 240, icon: "shield" },
      { week: 18, name: "Wisdom Walker", lore: "Took the slow road and learned faster.", xp: 240, icon: "compass" },
      { week: 19, name: "Balance Thinker", lore: "Found the middle path with grace.", xp: 250, icon: "atom" },
      { week: 20, name: "Ethical Navigator", lore: "Steered AI toward what is right.", xp: 260, icon: "compass" },
      { week: 21, name: "Responsible Innovator", lore: "Built tomorrow with care today.", xp: 300, icon: "crown" },
    ],
  },
  {
    key: "master",
    romanNum: "IV",
    name: "AI Master Quest",
    tagline: "Decode the patterns. Command the systems. Lead the future.",
    weekRange: "Weeks 22 – 28",
    guide: "dev",
    gradient: "from-challenge/85 via-story/70 to-xp/70",
    ring: "border-xp/40",
    glow: "bg-xp/35",
    chip: "bg-xp/15 text-xp",
    badges: [
      { week: 22, name: "Neural Navigator", lore: "Charted the rivers of neurons.", xp: 260, icon: "brain" },
      { week: 23, name: "Intelligence Mapper", lore: "Drew the map of thinking machines.", xp: 270, icon: "globe" },
      { week: 24, name: "Pattern Decoder", lore: "Cracked the secret code of data.", xp: 280, icon: "cpu" },
      { week: 25, name: "Data Voyager", lore: "Sailed across oceans of information.", xp: 290, icon: "rocket" },
      { week: 26, name: "System Strategist", lore: "Saw the whole board, made the right move.", xp: 300, icon: "atom" },
      { week: 27, name: "AI Commander", lore: "Led with both code and conscience.", xp: 320, icon: "shield" },
      { week: 28, name: "Quantum Explorer", lore: "Touched the edge of what's possible.", xp: 360, icon: "atom" },
    ],
  },
  {
    key: "legend",
    romanNum: "V",
    name: "Legendary AI Heroes",
    tagline: "Where collectors become legends and legends become galaxies.",
    weekRange: "Weeks 29 – 35",
    guide: "neo",
    gradient: "from-story/80 via-reflect/70 to-xp/80",
    ring: "border-bonus/50",
    glow: "bg-bonus/40",
    chip: "bg-bonus/20 text-bonus",
    badges: [
      { week: 29, name: "Future Shaper", lore: "Bends time toward better tomorrows.", xp: 360, icon: "wand" },
      { week: 30, name: "Innovation Legend", lore: "Their ideas echo across the network.", xp: 380, icon: "gem" },
      { week: 31, name: "Galaxy Thinker", lore: "Thinks in constellations, not lines.", xp: 400, icon: "atom" },
      { week: 32, name: "Visionary Hero", lore: "Sees what others cannot — yet.", xp: 420, icon: "eye" },
      { week: 33, name: "Cosmic Creator", lore: "Paints with stars and silicon.", xp: 440, icon: "sparkles" },
      { week: 34, name: "Infinite Explorer", lore: "Walks the endless corridor of curiosity.", xp: 480, icon: "infinity" },
      { week: 35, name: "Namma AI Grandmaster", lore: "Ultimate. Rarest of the rare. The final crown.", xp: 1000, icon: "trophy" },
    ],
  },
];

const ALL_BADGES: Badge[] = WORLDS.flatMap((w) => w.badges);
const CURRENT_WEEK = 9;

const GUIDE_IMG: Record<World["guide"], string> = {
  neo: neoCelebrating,
  dev: devHappy,
  anaya: anayaHappy,
};

/* -------------------------------------------------------------- */
/*                              PAGE                                */
/* -------------------------------------------------------------- */

function BadgesPage() {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [weeksDone, setWeeksDone] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [storedXp, setStoredXp] = React.useState(0);
  const [bonusEarned, setBonusEarned] = React.useState(0);

  React.useEffect(() => {
    const load = () => {
      setCompleted(new Set(getCompleted()));
      setWeeksDone(getCompletedWeeks().length);
      setStreak(getWeeklyStreak());
      setStoredXp(getTotalXP());
      // count earned badges from the store that aren't weekly activity badges
      setBonusEarned(
        getEarnedBadges().filter((b) => b.kind !== "weekly").length,
      );
    };
    load();
    const off = onNammaState(load);
    window.addEventListener("namma:progress", load);
    return () => {
      off();
      window.removeEventListener("namma:progress", load);
    };
  }, []);

  // First week begins at 1; current week = number of completed weeks + 1
  const currentWeek = Math.max(1, Math.min(35, weeksDone + 1));
  const week9AllDone = ACTIVITY_ORDER.every((s) => completed.has(s));

  const statusFor = (week: number): "earned" | "current" | "locked" => {
    if (week < currentWeek) return "earned";
    if (week === currentWeek) return week9AllDone ? "earned" : "current";
    return "locked";
  };

  const earned = ALL_BADGES.filter((b) => statusFor(b.week) === "earned");
  const totalEarned = earned.length + bonusEarned;
  const totalXp = earned.reduce((s, b) => s + b.xp, 0) + storedXp;
  const collectionPct = Math.round((earned.length / ALL_BADGES.length) * 100);
  const rarestEarned = earned.length ? earned[earned.length - 1] : null;
  const latestEarned = rarestEarned;
  const nextUp = ALL_BADGES.find((b) => statusFor(b.week) !== "earned") ?? ALL_BADGES[0];

  return (
    <AppShell>
      <div className="shell-inner !gap-10">
        <Hero
          totalEarned={totalEarned}
          collectionPct={collectionPct}
          totalXp={totalXp}
          rarest={rarestEarned}
          latest={latestEarned}
          nextUp={nextUp}
          streak={streak}
        />

        <CollectionStrip
          totalEarned={totalEarned}
          collectionPct={collectionPct}
          latest={latestEarned}
          rarest={rarestEarned}
          nextUp={nextUp}
        />

        {WORLDS.map((world, idx) => (
          <WorldSection
            key={world.key}
            world={world}
            index={idx}
            statusFor={statusFor}
          />
        ))}

        <FinaleCTA nextUp={nextUp} />
      </div>
    </AppShell>
  );
}

/* -------------------------------------------------------------- */
/*                              HERO                                */
/* -------------------------------------------------------------- */

function Hero({
  totalEarned,
  collectionPct,
  totalXp,
  rarest,
  latest,
  nextUp,
}: {
  totalEarned: number;
  collectionPct: number;
  totalXp: number;
  rarest: Badge | null;
  latest: Badge | null;
  nextUp: Badge;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: nammaEase }}
      className="relative overflow-hidden rounded-[40px] border border-white/70 bg-gradient-to-br from-story-soft via-white to-bonus-soft p-8 shadow-[var(--shadow-float)] md:p-12"
    >
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-story/35 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-xp/30 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-explore/25 blur-[100px]" />

      {/* Holographic grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-2xl">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 rounded-full border border-bonus/30 bg-bonus/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-bonus">
              <Trophy className="h-3 w-3" /> Trophy Vault
            </div>
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-foreground md:text-6xl">
            Your{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-story via-reflect to-xp bg-clip-text text-transparent">
                AI Trophy Vault
              </span>
              <Sparkles className="absolute -top-3 -right-7 h-6 w-6 text-bonus animate-[namma-pulse_2.4s_ease-in-out_infinite]" />
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Every completed adventure unlocks a magical collectible badge from the
            Namma AI universe. Collect all <span className="font-bold text-foreground">35 legendary tokens</span> and
            ascend to Grandmaster.
          </p>

          <div className="flex flex-wrap gap-3">
            <HeroStat icon={Trophy} value={`${totalEarned}/35`} label="Badges earned" tone="bonus" />
            <HeroStat icon={Flame} value="9 wks" label="Weekly streak" tone="challenge" />
            <HeroStat icon={Crown} value="Explorer" label="Current rank" tone="story" />
            <HeroStat icon={Star} value={`${totalXp.toLocaleString()} XP`} label="Collected" tone="xp" />
          </div>

          {/* Collection rail */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <span>Collection complete</span>
              <span className="text-foreground">{collectionPct}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${collectionPct}%` }}
                transition={{ duration: 1.2, ease: nammaEase }}
                className="h-full rounded-full bg-gradient-to-r from-story via-reflect to-xp shadow-[0_0_22px_rgba(0,0,0,0.18)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] animate-[namma-progress_2.4s_ease-in-out_infinite] mix-blend-overlay" />
            </div>
            <p className="text-xs text-muted-foreground">
              Next up: <span className="font-bold text-foreground">{nextUp.name}</span> · Week {nextUp.week}
            </p>
          </div>
        </div>

        {/* Neo presenting badges */}
        <div className="relative hidden h-[420px] md:block">
          {/* Orbits */}
          <div className="absolute inset-8 rounded-full border border-dashed border-story/30 animate-[orbit-drift_14s_ease-in-out_infinite]" />
          <div className="absolute inset-16 rounded-full border border-dashed border-bonus/30 animate-[orbit-drift_18s_ease-in-out_infinite_reverse]" />

          {/* Floating mini-badges */}
          <FloatingBadge icon={Gem} color="story" className="left-2 top-6" delay={0} />
          <FloatingBadge icon={Crown} color="bonus" className="right-4 top-12" delay={0.6} />
          <FloatingBadge icon={Sparkles} color="reflect" className="left-6 bottom-16" delay={1.2} />
          <FloatingBadge icon={Shield} color="challenge" className="right-2 bottom-8" delay={1.8} />
          <FloatingBadge icon={Star} color="xp" className="right-16 top-1/2" delay={2.4} />

          {/* Neo */}
          <motion.img
            src={neoCelebrating}
            alt="Neo presenting your trophy vault"
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: nammaEase, delay: 0.2 }}
            className="relative z-10 mx-auto h-full w-full object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_25px_45px_rgba(0,0,0,0.22)]"
          />

          {/* Glow base */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-full bg-bonus/40 blur-3xl" />
        </div>
      </div>
    </motion.section>
  );
}

function HeroStat({
  icon: Icon, value, label, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string; label: string; tone: string;
}) {
  return (
    <div className={cn(
      "inline-flex items-center gap-3 rounded-2xl border bg-white/80 px-3.5 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur",
      `border-${tone}/30`,
    )}>
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", `bg-${tone}/15 text-${tone}`)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-extrabold text-foreground">{value}</div>
        <div className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FloatingBadge({
  icon: Icon, color, className, delay,
}: { icon: React.ComponentType<{ className?: string }>; color: string; className?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay * 0.15, duration: 0.6, ease: nammaEase }}
      className={cn("absolute z-20 animate-[namma-float_5s_ease-in-out_infinite]", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-white/85 shadow-[var(--shadow-float)] backdrop-blur",
        `border-${color}/40`,
      )}>
        <div className={cn("absolute inset-0 -z-10 rounded-2xl blur-xl", `bg-${color}/40`)} />
        <Icon className={cn("h-6 w-6", `text-${color}`)} />
      </div>
    </motion.div>
  );
}

function FloatingParticles() {
  const items = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 4,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-bonus/60 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `namma-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- */
/*                        COLLECTION STRIP                          */
/* -------------------------------------------------------------- */

function CollectionStrip({
  totalEarned, collectionPct, latest, rarest, nextUp,
}: {
  totalEarned: number; collectionPct: number;
  latest: Badge | null; rarest: Badge | null; nextUp: Badge;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <CollectionCard
        label="Recent unlock"
        title={latest?.name ?? "Yet to begin"}
        sub={latest ? `Week ${latest.week} · +${latest.xp} XP` : "Complete Week 1 to unlock"}
        icon={latest ? ICONS[latest.icon] : Sparkles}
        tone="story"
        emphasis="Another magical badge joins your collection."
      />
      <CollectionCard
        label="Rarest earned"
        title={rarest?.name ?? "—"}
        sub={rarest ? `Week ${rarest.week} · Legendary tier` : "Keep climbing"}
        icon={rarest ? ICONS[rarest.icon] : Gem}
        tone="reflect"
        emphasis="Your AI journey is evolving beautifully."
      />
      <CollectionCard
        label="Collection"
        title={`${totalEarned} / 35`}
        sub={`${collectionPct}% complete`}
        icon={Trophy}
        tone="bonus"
        emphasis="One step closer to Grandmaster."
        progress={collectionPct}
      />
      <CollectionCard
        label="Up next"
        title={nextUp.name}
        sub={`Week ${nextUp.week} · +${nextUp.xp} XP awaits`}
        icon={ICONS[nextUp.icon]}
        tone="xp"
        emphasis="Neo is cheering you on."
      />
    </section>
  );
}

function CollectionCard({
  label, title, sub, icon: Icon, tone, emphasis, progress,
}: {
  label: string; title: string; sub: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string; emphasis: string; progress?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: nammaEase }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-[26px] border bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:shadow-[var(--shadow-float)]",
        `border-${tone}/25`,
      )}
    >
      <div className={cn("pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl", `bg-${tone}/35`)} />
      <div className="relative flex items-start justify-between">
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", `bg-${tone}/15 text-${tone}`)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="relative mt-4 font-display text-lg font-extrabold leading-tight text-foreground">{title}</div>
      <div className="relative mt-1 text-xs text-muted-foreground">{sub}</div>
      {typeof progress === "number" && (
        <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", `bg-${tone}`)} style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="relative mt-3 text-[0.7rem] italic text-muted-foreground/90">{emphasis}</div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                          WORLD SECTION                           */
/* -------------------------------------------------------------- */

function WorldSection({
  world, index, statusFor,
}: {
  world: World; index: number;
  statusFor: (week: number) => "earned" | "current" | "locked";
}) {
  const earnedInWorld = world.badges.filter((b) => statusFor(b.week) === "earned").length;
  const worldPct = Math.round((earnedInWorld / world.badges.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: nammaEase }}
      className="relative"
    >
      {/* World header */}
      <div className={cn(
        "relative overflow-hidden rounded-[32px] border bg-gradient-to-r p-6 shadow-[var(--shadow-soft)] md:p-7",
        world.gradient, world.ring,
      )}>
        <div className={cn("pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl", world.glow)} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:22px_22px] text-white" />

        <div className="relative grid items-center gap-5 md:grid-cols-[1fr_auto]">
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 font-display text-sm font-extrabold backdrop-blur">
                {world.romanNum}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-90">
                World {index + 1} · {world.weekRange}
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
              {world.name}
            </h2>
            <p className="max-w-xl text-sm text-white/85 md:text-base">{world.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 p-1.5 backdrop-blur">
              <img src={GUIDE_IMG[world.guide]} alt={world.guide} className="h-full w-full object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_10px_18px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-white backdrop-blur">
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-90">Collection</div>
              <div className="font-display text-xl font-extrabold leading-none">{earnedInWorld}/{world.badges.length}</div>
              <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white" style={{ width: `${worldPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {world.badges.map((b, i) => (
          <BadgeCard
            key={b.week}
            badge={b}
            world={world}
            status={statusFor(b.week)}
            index={i}
            legendary={b.week === 35}
          />
        ))}
      </div>
    </motion.section>
  );
}

/* -------------------------------------------------------------- */
/*                            BADGE CARD                            */
/* -------------------------------------------------------------- */

function BadgeCard({
  badge, world, status, index, legendary,
}: {
  badge: Badge; world: World;
  status: "earned" | "current" | "locked";
  index: number; legendary?: boolean;
}) {
  const Icon = ICONS[badge.icon];
  const isLocked = status === "locked";
  const isEarned = status === "earned";
  const isCurrent = status === "current";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: nammaEase }}
      whileHover={!isLocked ? { y: -6, rotate: legendary ? 0 : -0.5 } : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border bg-gradient-to-b from-white/90 to-white/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all",
        !isLocked && "hover:shadow-[var(--shadow-float)]",
        isEarned ? world.ring : isCurrent ? `${world.ring} ring-2 ring-offset-2 ring-offset-background` : "border-locked/30",
        legendary && "sm:col-span-2 lg:col-span-1 xl:col-span-2",
      )}
    >
      {/* Holographic background sweep */}
      {!isLocked && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:left-full transition-all duration-1000" />
        </div>
      )}

      {/* Aura */}
      <div className={cn(
        "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl transition-opacity",
        isEarned ? `${world.glow} opacity-90` : isCurrent ? `${world.glow} opacity-70` : "bg-locked/20 opacity-40",
      )} />

      {/* Top row */}
      <div className="relative flex items-center justify-between">
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.2em]",
          isLocked ? "bg-locked/15 text-muted-foreground" : world.chip,
        )}>
          Week {badge.week}
        </span>
        {isEarned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-success">
            <Sparkles className="h-2.5 w-2.5" /> Earned
          </span>
        )}
        {isCurrent && (
          <span className="relative inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-background">
            <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground animate-ping" />
            In progress
          </span>
        )}
        {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>

      {/* Badge medallion */}
      <div className="relative mt-5 flex items-center justify-center">
        {/* Outer holographic ring */}
        <div className={cn(
          "relative flex items-center justify-center rounded-full p-1",
          legendary ? "h-32 w-32" : "h-24 w-24",
          isEarned
            ? `bg-gradient-to-br ${world.gradient}`
            : isCurrent
              ? `bg-gradient-to-br ${world.gradient} opacity-80`
              : "bg-gradient-to-br from-locked/40 to-locked/10",
        )}>
          {/* Spinning conic ring for earned */}
          {(isEarned || legendary) && (
            <div className="pointer-events-none absolute -inset-1 rounded-full opacity-70 mix-blend-screen [background:conic-gradient(from_0deg,transparent,white,transparent_30%)] animate-[spin_8s_linear_infinite]" />
          )}

          {/* Inner medallion */}
          <div className={cn(
            "relative flex h-full w-full items-center justify-center rounded-full border bg-white/90 backdrop-blur",
            isLocked ? "border-locked/30" : "border-white",
          )}>
            {isLocked ? (
              <>
                <div className="absolute inset-2 rounded-full bg-gradient-to-b from-locked/30 to-locked/10 blur-sm" />
                <Lock className="relative h-7 w-7 text-locked" />
                <span className="absolute -bottom-1 inline-flex h-2 w-2 animate-ping rounded-full bg-locked/60" />
              </>
            ) : (
              <>
                <div className={cn(
                  "absolute inset-1.5 rounded-full bg-gradient-to-br",
                  world.gradient, "opacity-20",
                )} />
                <Icon className={cn(
                  "relative drop-shadow-md",
                  legendary ? "h-12 w-12" : "h-9 w-9",
                  isCurrent ? "text-foreground/70" : "text-foreground",
                )} />
                {legendary && (
                  <Sparkles className="absolute -top-2 -right-1 h-5 w-5 text-bonus animate-[namma-pulse_2s_ease-in-out_infinite]" />
                )}
              </>
            )}
          </div>

          {/* Glow base */}
          {!isLocked && (
            <div className={cn(
              "pointer-events-none absolute -bottom-3 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full blur-xl",
              world.glow,
            )} />
          )}
        </div>
      </div>

      {/* Name + lore */}
      <div className="relative mt-5 text-center">
        <h3 className={cn(
          "font-display font-extrabold leading-tight",
          legendary ? "text-xl md:text-2xl" : "text-base",
          isLocked ? "text-muted-foreground" : "text-foreground",
        )}>
          {isLocked ? "???" : badge.name}
        </h3>
        <p className={cn(
          "mt-1.5 text-xs leading-5",
          isLocked ? "text-muted-foreground/70 blur-[1.5px] select-none" : "text-muted-foreground",
        )}>
          {badge.lore}
        </p>
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between border-t border-dashed border-border/60 pt-3">
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-bold",
          isLocked ? "bg-locked/15 text-muted-foreground" : "bg-xp-soft text-xp",
        )}>
          <Star className="h-3 w-3" /> +{badge.xp} XP
        </span>
        {isLocked ? (
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Complete Week {badge.week}
          </span>
        ) : isCurrent ? (
          <Link
            to="/activities"
            className="inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground hover:text-primary"
          >
            Unlock now <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-success">
            Collected
          </span>
        )}
      </div>

      {legendary && (
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-bonus/40" />
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------- */
/*                          FINALE CTA                              */
/* -------------------------------------------------------------- */

function FinaleCTA({ nextUp }: { nextUp: Badge }) {
  const Icon = ICONS[nextUp.icon];
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: nammaEase }}
      className="relative overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-foreground via-challenge/90 to-story p-8 text-white shadow-[var(--shadow-float)] md:p-12"
    >
      <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-story/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-bonus/40 blur-3xl" />
      <FloatingParticles />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] backdrop-blur">
            <Sparkles className="h-3 w-3" /> Next badge awaits
          </div>
          <h3 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
            {nextUp.name} is one adventure away.
          </h3>
          <p className="max-w-xl text-white/85 md:text-lg">
            “{nextUp.lore}” Finish Week {nextUp.week}'s six activities and this magical
            token slides into your vault — glowing forever.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="hero" size="lg" asChild>
              <Link to="/activities">
                Continue your quest <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-3 py-2 font-display text-sm font-bold backdrop-blur">
              <Star className="h-4 w-4" /> +{nextUp.xp} XP reward
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[orbit-drift_14s_ease-in-out_infinite]" />
          <div className="absolute inset-6 rounded-full border border-dashed border-white/20 animate-[orbit-drift_18s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-bonus via-story to-reflect blur-2xl opacity-70" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/60 bg-white/15 backdrop-blur shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
            <Icon className="h-14 w-14 text-white drop-shadow-[0_4px_18px_rgba(255,255,255,0.6)]" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-bonus animate-[namma-pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
