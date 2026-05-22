import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  Crown,
  Globe2,
  GraduationCap,
  Heart,
  Lock,
  Medal,
  Rocket,
  Scale,
  Search,
  Sparkles,
  Star,
  Trophy,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import { addXP, awardBadge, getSubmission, hasBadge, saveSubmission } from "@/lib/namma-progress";
import { toast } from "sonner";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import anayaExplaining from "@/assets/characters/anaya-explaining.png";
import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";

/* Storage */
const GRADE_KEY = "namma:grade";
type Grade = "5-6" | "7-8" | "9-10";

function getGrade(): Grade {
  if (typeof window === "undefined") return "7-8";
  const g = window.localStorage.getItem(GRADE_KEY);
  if (g === "5-6" || g === "7-8" || g === "9-10") return g;
  return "7-8";
}
function setStoredGrade(g: Grade) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GRADE_KEY, g);
  window.dispatchEvent(new CustomEvent("namma:grade"));
}

function doneKey(weekId: string) {
  return `namma:challenges:${weekId}`;
}
function getDoneChallenges(weekId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(doneKey(weekId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function markChallengeDone(weekId: string, id: string) {
  if (typeof window === "undefined") return;
  const s = new Set(getDoneChallenges(weekId));
  s.add(id);
  window.localStorage.setItem(doneKey(weekId), JSON.stringify([...s]));
  window.dispatchEvent(new CustomEvent("namma:challenges"));
}

/* Data */
type Field =
  | { type: "text"; key: string; label: string; placeholder: string }
  | { type: "textarea"; key: string; label: string; placeholder: string }
  | { type: "chips"; key: string; label: string; options: string[] }
  | { type: "scenario"; key: string; label: string; options: { id: string; title: string; tag: string }[] };

type Challenge = {
  id: string;
  tier: "advanced" | "expert";
  index: number;
  title: string;
  tagline: string;
  theme: string;
  icon: typeof Rocket;
  tone: "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";
  character: { name: "Neo" | "Dev" | "Anaya"; image: string; celebrate: string };
  feedback: string;
  ctaLabel: string;
  fields: Field[];
  xp: number;
};

const ADVANCED: Challenge[] = [
  {
    id: "adv-detective",
    tier: "advanced",
    index: 1,
    title: "AI Detective Mission",
    tagline: "Spot the invisible AI hiding in everyday life.",
    theme: "Investigate where AI quietly powers the world around you.",
    icon: Search,
    tone: "explore",
    character: { name: "Neo", image: neoExplaining, celebrate: neoCelebrating },
    feedback:
      "Great spotting! You're starting to think like an AI detective. The world is full of invisible patterns — and you just decoded one.",
    ctaLabel: "Unlock Insight",
    xp: 120,
    fields: [
      { type: "textarea", key: "observed", label: "What did you observe?", placeholder: "e.g. My phone unlocked instantly when I looked at it…" },
      { type: "chips", key: "where", label: "Where do you think AI is used?", options: ["Camera", "Maps", "YouTube", "Music app", "Smart speaker", "Online store", "Game", "Bank app"] },
      { type: "textarea", key: "why", label: "Why do you think so?", placeholder: "What clues told you AI was working behind the scenes?" },
    ],
  },
  {
    id: "adv-helper",
    tier: "advanced",
    index: 2,
    title: "Build Your Own AI Helper",
    tagline: "Invent an AI sidekick that solves a real problem.",
    theme: "Design a tiny AI tool with a name, a purpose, and a personality.",
    icon: Wand2,
    tone: "decide",
    character: { name: "Dev", image: devExplaining, celebrate: devCelebrating },
    feedback: "That sounds like a real startup idea! Your AI helper has heart and purpose — exactly what great inventions need.",
    ctaLabel: "Launch Idea",
    xp: 140,
    fields: [
      { type: "chips", key: "category", label: "Pick a category", options: ["Learning", "Health", "Home", "Environment", "Sports", "Creativity"] },
      { type: "textarea", key: "problem", label: "What problem does it solve?", placeholder: "Describe the everyday problem your AI tackles…" },
      { type: "text", key: "name", label: "Name your AI helper", placeholder: "e.g. StudyBuddy, EcoPal, MoodMate" },
      { type: "chips", key: "traits", label: "Pick personality traits", options: ["Kind", "Curious", "Funny", "Calm", "Bold", "Wise", "Playful", "Patient"] },
    ],
  },
  {
    id: "adv-future",
    tier: "advanced",
    index: 3,
    title: "Future World Challenge",
    tagline: "Imagine daily life 20 years from now.",
    theme: "Picture a holographic city where AI shapes how we live, learn, and care.",
    icon: Globe2,
    tone: "reflect",
    character: { name: "Anaya", image: anayaExplaining, celebrate: anayaCelebrating },
    feedback:
      "Beautiful thinking. The future you imagined is thoughtful — you remembered both the wonder AND the responsibility. That's wisdom.",
    ctaLabel: "Enter the Future",
    xp: 150,
    fields: [
      { type: "scenario", key: "school", label: "School in the future", options: [
        { id: "holo", title: "Holographic classrooms", tag: "Learn from anywhere" },
        { id: "tutor", title: "Personal AI tutor", tag: "1-on-1 forever" },
        { id: "vr", title: "Time-travel history class", tag: "Walk through eras" },
      ] },
      { type: "scenario", key: "transport", label: "Transport in the future", options: [
        { id: "pod", title: "Self-driving sky pods", tag: "Zero traffic" },
        { id: "hyper", title: "Hyperloop tunnels", tag: "City to city in minutes" },
        { id: "bike", title: "Smart bikes that route you", tag: "Greenest path" },
      ] },
      { type: "textarea", key: "good", label: "One good impact AI will have", placeholder: "Something you're excited about…" },
      { type: "textarea", key: "risk", label: "One risky impact to watch for", placeholder: "What should we be careful about?" },
    ],
  },
];

const EXPERT: Challenge[] = [
  {
    id: "exp-studio",
    tier: "expert",
    index: 1,
    title: "AI Product Studio",
    tagline: "Design a complete AI product like a real founder.",
    theme: "Pitch a product with a name, users, problem, features, and ethics.",
    icon: Cpu,
    tone: "decide",
    character: { name: "Dev", image: devExplaining, celebrate: devCelebrating },
    feedback:
      "You're thinking like a real product creator. The way you framed users + ethics shows founder-level judgement.",
    ctaLabel: "Pitch It",
    xp: 220,
    fields: [
      { type: "text", key: "name", label: "Product name", placeholder: "e.g. LumenAI, KavachAI…" },
      { type: "chips", key: "users", label: "Target users", options: ["Students", "Teachers", "Doctors", "Farmers", "Small businesses", "Parents", "Creators", "Elderly"] },
      { type: "textarea", key: "problem", label: "Problem statement", placeholder: "Who is hurting today, and how?" },
      { type: "textarea", key: "features", label: "Key features (top 3)", placeholder: "1. …\n2. …\n3. …" },
      { type: "chips", key: "money", label: "Monetization idea", options: ["Freemium", "Subscription", "Pay per use", "Ads", "Schools licence", "B2B"] },
      { type: "textarea", key: "ethics", label: "One ethical concern", placeholder: "What's a risk your product must handle responsibly?" },
    ],
  },
  {
    id: "exp-council",
    tier: "expert",
    index: 2,
    title: "AI Ethics Council",
    tagline: "Debate the hardest decisions AI brings to society.",
    theme: "Step into a council chamber and weigh both sides of the scale.",
    icon: Scale,
    tone: "reflect",
    character: { name: "Anaya", image: anayaExplaining, celebrate: anayaCelebrating },
    feedback:
      "A thoughtful, balanced verdict. Real ethics isn't about being right — it's about who you protect.",
    ctaLabel: "Submit Verdict",
    xp: 240,
    fields: [
      { type: "scenario", key: "scenario", label: "Choose a scenario to rule on", options: [
        { id: "teach", title: "AI replacing teachers", tag: "Education" },
        { id: "face", title: "Facial recognition in schools", tag: "Privacy" },
        { id: "grade", title: "AI grading exams", tag: "Fairness" },
        { id: "watch", title: "AI surveillance in cities", tag: "Safety" },
      ] },
      { type: "chips", key: "decision", label: "Your decision", options: ["Allow with limits", "Ban completely", "Allow freely", "Pause & study"] },
      { type: "textarea", key: "reason", label: "Reasoning", placeholder: "Why is this the right call?" },
      { type: "textarea", key: "risks", label: "Biggest risks if you're wrong", placeholder: "What could go badly?" },
      { type: "textarea", key: "verdict", label: "Final verdict (one sentence)", placeholder: "State your ruling clearly…" },
    ],
  },
  {
    id: "exp-founder",
    tier: "expert",
    index: 3,
    title: "Future Founder Challenge",
    tagline: "Create an AI-powered company that shapes the future.",
    theme: "Build a vision: company, slogan, technology, and social impact.",
    icon: Rocket,
    tone: "challenge",
    character: { name: "Neo", image: neoExplaining, celebrate: neoCelebrating },
    feedback:
      "Your future company is now part of the AI universe! Bold vision, human impact — the rarest combination.",
    ctaLabel: "Reveal Founder Card",
    xp: 260,
    fields: [
      { type: "text", key: "company", label: "Company name", placeholder: "e.g. Aether Labs" },
      { type: "text", key: "slogan", label: "Slogan", placeholder: "One unforgettable line…" },
      { type: "chips", key: "industry", label: "Industry", options: ["Healthcare", "Education", "Climate", "Space", "Mobility", "Agriculture", "Robotics", "Creativity"] },
      { type: "textarea", key: "tech", label: "Future technology you'll build", placeholder: "What does your AI actually do?" },
      { type: "textarea", key: "experience", label: "Customer experience", placeholder: "How does it feel to use it?" },
      { type: "textarea", key: "impact", label: "Social impact", placeholder: "How does the world become better?" },
    ],
  },
];

/* ────────────────────────────────────────────────── */

export function WeeklyChallenges({ weekId = "week-9" }: { weekId?: string }) {
  const [grade, setGrade] = React.useState<Grade>("7-8");
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [doneChallenges, setDoneChallenges] = React.useState<Set<string>>(new Set());
  const [active, setActive] = React.useState<Challenge | null>(null);
  const [showUnlock, setShowUnlock] = React.useState(false);
  const seenUnlockRef = React.useRef(false);

  React.useEffect(() => {
    setGrade(getGrade());
    setCompleted(new Set(getCompleted()));
    setDoneChallenges(new Set(getDoneChallenges(weekId)));
    const refresh = () => {
      setCompleted(new Set(getCompleted()));
      setDoneChallenges(new Set(getDoneChallenges(weekId)));
      setGrade(getGrade());
    };
    window.addEventListener("namma:progress", refresh);
    window.addEventListener("namma:challenges", refresh);
    window.addEventListener("namma:grade", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("namma:progress", refresh);
      window.removeEventListener("namma:challenges", refresh);
      window.removeEventListener("namma:grade", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [weekId]);

  const weeklyDone = completed.size >= ACTIVITY_ORDER.length;
  const tier: "advanced" | "expert" | null =
    grade === "7-8" ? "advanced" : grade === "9-10" ? "expert" : null;
  const challenges = tier === "advanced" ? ADVANCED : tier === "expert" ? EXPERT : [];

  React.useEffect(() => {
    if (weeklyDone && tier && !seenUnlockRef.current) {
      const key = `namma:unlock:${weekId}:${tier}`;
      if (typeof window !== "undefined" && !window.localStorage.getItem(key)) {
        setShowUnlock(true);
        seenUnlockRef.current = true;
        window.localStorage.setItem(key, "1");

        // Reward artifact for the unlock moment
        const tierUnlockBadge =
          tier === "advanced"
            ? { name: "Advanced Portal Opened", desc: "Unlocked the Advanced Explorer track." }
            : { name: "Expert Lab Opened", desc: "Unlocked the Expert Creator Lab." };
        const awarded = awardBadge({
          id: `tier-unlock:${weekId}:${tier}`,
          name: tierUnlockBadge.name,
          kind: "tier-unlock",
          weekId,
          tone: "bonus",
          xp: 100,
          description: tierUnlockBadge.desc,
        });
        if (awarded) {
          addXP(100, `Portal unlocked · ${tier}`, weekId);
          toast.success(`${tierUnlockBadge.name}`, {
            description: "+100 bonus XP · new badge added to your vault",
          });
        }
      }
    }
  }, [weeklyDone, tier, weekId]);

  const completeChallenge = (id: string, values: Record<string, unknown>) => {
    const ch = challenges.find((c) => c.id === id);
    if (!ch) return;
    const already = !!getSubmission(weekId, id);
    markChallengeDone(weekId, id);
    saveSubmission({
      id,
      weekId,
      title: ch.title,
      tier: ch.tier,
      values,
      xp: ch.xp,
    });
    if (!already) {
      addXP(ch.xp, `Challenge · ${ch.title}`, weekId);
      const newlyBadged = awardBadge({
        id: `challenge:${weekId}:${id}`,
        name: `${ch.title} Badge`,
        kind: "challenge",
        weekId,
        tone: ch.tone,
        xp: ch.xp,
        description: ch.tagline,
      });
      toast.success(`+${ch.xp} XP earned`, {
        description: newlyBadged ? `${ch.title} Badge unlocked` : `${ch.title} re-submitted`,
      });

      // Tier-completion master badge
      const nextDone = new Set([...doneChallenges, id]);
      const allTierDone = challenges.every((c) => nextDone.has(c.id));
      if (allTierDone) {
        const tierBadgeName =
          ch.tier === "advanced" ? "Advanced Explorer Badge" : "Future Innovator Badge";
        const awarded = awardBadge({
          id: `tier-complete:${weekId}:${ch.tier}`,
          name: tierBadgeName,
          kind: "milestone",
          weekId,
          tone: "bonus",
          xp: 200,
        });
        if (awarded) {
          addXP(200, `Tier complete · ${ch.tier}`, weekId);
          toast.success(`${tierBadgeName} unlocked!`, {
            description: "+200 bonus XP · all 3 elite missions complete",
          });
        }
      }
    } else {
      toast(`${ch.title} re-submitted`, { description: "Your latest answers are saved." });
    }
    setDoneChallenges(new Set([...doneChallenges, id]));
  };

  return (
    <section className="space-y-6">
      <GlowDivider />
      <GradePicker grade={grade} onChange={(g) => { setStoredGrade(g); setGrade(g); }} />

      {grade === "5-6" && <YoungerExplorerState />}
      {tier && !weeklyDone && <LockedShell completed={completed.size} total={ACTIVITY_ORDER.length} tier={tier} />}
      {tier && weeklyDone && !active && (
        <UnlockedHub tier={tier} challenges={challenges} done={doneChallenges} onOpen={setActive} />
      )}
      {tier && weeklyDone && active && (
        <ChallengeFlow
          challenge={active}
          isDone={doneChallenges.has(active.id)}
          weekId={weekId}
          onBack={() => setActive(null)}
          onComplete={(values) => completeChallenge(active.id, values)}
        />
      )}

      <AnimatePresence>
        {showUnlock && tier && <UnlockCinematic tier={tier} onClose={() => setShowUnlock(false)} />}
      </AnimatePresence>
    </section>
  );
}

/* Glowing divider between main flow and bonus layer */
function GlowDivider() {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-challenge/40 to-transparent" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="mx-4 inline-flex items-center gap-2 rounded-full border border-challenge/30 bg-gradient-to-r from-bonus-soft via-white to-challenge-soft px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge shadow-[0_0_24px_rgba(255,150,50,0.25)]"
      >
        <Sparkles className="h-3 w-3" /> Bonus Layer
      </motion.div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-challenge/40 to-transparent" />
    </div>
  );
}

/* Grade picker */
function GradePicker({ grade, onChange }: { grade: Grade; onChange: (g: Grade) => void }) {
  const opts: { value: Grade; label: string; sub: string; icon: typeof GraduationCap }[] = [
    { value: "5-6", label: "Grades 5–6", sub: "Weekly Adventure", icon: Sparkles },
    { value: "7-8", label: "Grades 7–8", sub: "Advanced Layer", icon: Rocket },
    { value: "9-10", label: "Grades 9–10", sub: "Expert Creator Lab", icon: Crown },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: nammaEase }}
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur"
    >
      <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        Your grade
      </div>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const active = grade === o.value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition-all",
                active
                  ? "border-challenge/50 bg-gradient-to-br from-challenge-soft to-bonus-soft shadow-[var(--shadow-soft)]"
                  : "border-border/60 bg-white/80 hover:border-foreground/30",
              )}
            >
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", active ? "bg-gradient-to-br from-challenge to-bonus text-white" : "bg-muted text-muted-foreground")}>
                <o.icon className="h-3.5 w-3.5" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xs font-bold">{o.label}</span>
                <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{o.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* 5–6 state */
function YoungerExplorerState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-explore/25 bg-gradient-to-br from-explore-soft via-white to-story-soft p-7 shadow-[var(--shadow-soft)]"
    >
      <div className="grid items-center gap-6 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-explore/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
            <Heart className="h-3 w-3" /> Just for you
          </div>
          <h3 className="font-display text-2xl font-extrabold leading-tight">
            Keep exploring your Weekly Adventure ✨
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Bonus challenges open up in Grades 7–10. For now, the magic lives right inside your 6 weekly activities.
          </p>
        </div>
        <div className="relative hidden h-40 items-end justify-center md:flex">
          <img src={neoHappy} alt="Neo" className="h-36 w-36 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
        </div>
      </div>
    </motion.div>
  );
}

/* Locked */
function LockedShell({ completed, total, tier }: { completed: number; total: number; tier: "advanced" | "expert" }) {
  const pct = Math.round((completed / total) * 100);
  const label = tier === "advanced" ? "Advanced Explorer Challenges" : "Expert Creator Lab";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-locked/30 bg-gradient-to-br from-locked-soft via-white to-challenge-soft p-7 shadow-[var(--shadow-soft)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_30%_20%,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-locked/12 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-locked">
          <Lock className="h-3 w-3" /> Locked · finish this week
        </div>
        <h3 className="font-display text-2xl font-extrabold leading-tight">
          {label} <span className="text-muted-foreground">·</span> <span className="text-decide">unlocks soon</span>
        </h3>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Complete all 6 weekly activities and a glowing portal will open right here. Inside: 3 prestigious bonus missions made just for you.
        </p>

        {/* Blurred preview cards */}
        <div className="grid gap-3 pt-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/60 p-5 shadow-[var(--shadow-soft)]">
              <div className="pointer-events-none absolute inset-0 backdrop-blur-md" />
              <div className="relative space-y-3 opacity-60">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-locked to-locked/70 text-white">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="h-3 w-3/4 rounded-full bg-muted" />
                <div className="h-2 w-1/2 rounded-full bg-muted" />
              </div>
              <div className="absolute inset-x-0 bottom-3 text-center text-[0.62rem] font-bold uppercase tracking-[0.18em] text-locked">
                ?? Mysterious mission ??
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-white/70 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <span>Weekly progress</span>
            <span className="text-foreground">{completed} / {total}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: nammaEase }}
              className="h-full rounded-full bg-gradient-to-r from-decide via-challenge to-bonus"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Cinematic */
function UnlockCinematic({ tier, onClose }: { tier: "advanced" | "expert"; onClose: () => void }) {
  const title = tier === "advanced" ? "Advanced Challenges Unlocked!" : "Expert Creator Lab Unlocked!";
  const sub = tier === "advanced"
    ? "Neo unlocked three elite missions for this week…"
    : "Your creator journey continues. Three expert missions await.";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md p-6"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -180 - Math.random() * 120],
              x: [0, (Math.random() - 0.5) * 240],
              scale: [0.4, 1, 0.6],
            }}
            transition={{ duration: 2.2 + Math.random(), repeat: Infinity, delay: Math.random() * 0.8 }}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-gradient-to-br from-bonus to-challenge shadow-[0_0_18px_rgba(255,180,80,0.7)]"
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5, ease: nammaEase }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-white via-bonus-soft to-challenge-soft p-8 text-center shadow-[var(--shadow-float)]"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.1, 1], opacity: [0, 0.8, 1] }}
          transition={{ duration: 0.9, ease: nammaEase }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-challenge via-bonus to-reflect shadow-[0_0_60px_rgba(255,150,50,0.55)]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-white/60"
          >
            <Trophy className="h-10 w-10 text-white drop-shadow" />
          </motion.div>
        </motion.div>

        <img
          src={neoCelebrating}
          alt="Neo celebrating"
          className="mx-auto -mt-6 h-28 w-28 object-contain animate-[namma-float_4s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
        />

        <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{sub}</p>

        <Button variant="hero" size="lg" className="mt-5 w-full" onClick={onClose}>
          Enter the Bonus Layer <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* Unlocked hub */
function UnlockedHub({ tier, challenges, done, onOpen }: { tier: "advanced" | "expert"; challenges: Challenge[]; done: Set<string>; onOpen: (c: Challenge) => void }) {
  const totalXp = challenges.reduce((s, c) => s + c.xp, 0);
  const allDone = challenges.every((c) => done.has(c.id));
  const badge = tier === "advanced" ? "Advanced Explorer Badge" : "Future Innovator Badge";
  const title = tier === "advanced" ? "Advanced Explorer Challenges" : "Expert Creator Lab";
  const sub = "Unlocked after completing this week's adventure.";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: nammaEase }}
        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-bonus-soft via-white to-challenge-soft p-7 shadow-[var(--shadow-float)]"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-bonus/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-challenge/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-challenge/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
              <Sparkles className="h-3 w-3" /> {tier === "advanced" ? "For Grades 7–8" : "For Grades 9–10"}
            </div>
            <h3 className="font-display text-3xl font-extrabold leading-tight">{title}</h3>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">{sub}</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-1.5 text-xs font-bold text-xp">
                <Star className="h-3.5 w-3.5" /> {totalXp} bonus XP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-bonus/30 bg-bonus-soft/70 px-3 py-1.5 text-xs font-bold text-bonus">
                <Medal className="h-3.5 w-3.5" /> {badge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-1.5 text-xs font-bold text-success">
                <Check className="h-3.5 w-3.5" /> {done.size}/{challenges.length} done
              </span>
            </div>
          </div>
          <div className="relative hidden h-48 items-end justify-center md:flex">
            <motion.img src={devCelebrating} alt="Dev" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-2 left-2 h-32 w-32 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
            <motion.img src={neoCelebrating} alt="Neo" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="relative h-40 w-40 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]" />
            <motion.img src={anayaCelebrating} alt="Anaya" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-2 right-2 h-32 w-32 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
          </div>
        </div>
        {allDone && (
          <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-bonus to-challenge px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-soft)]">
            <Crown className="h-3.5 w-3.5" /> {badge} earned
          </div>
        )}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {challenges.map((c, i) => {
          const isDone = done.has(c.id);
          return (
            <motion.button
              key={c.id}
              onClick={() => onOpen(c)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: nammaEase }}
              className={cn(
                "group relative overflow-hidden rounded-[26px] border bg-white/85 p-6 text-left shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                `border-${c.tone}/25 hover:border-foreground/30`,
                isDone && "ring-2 ring-bonus/40",
              )}
            >
              <div className={cn("pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-50 blur-3xl transition-opacity group-hover:opacity-80", `bg-${c.tone}/30`)} />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-soft)]", `bg-gradient-to-br from-${c.tone} to-${c.tone}/70`)}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-bonus to-challenge px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white">
                      <Trophy className="h-3 w-3" /> Complete
                    </span>
                  ) : (
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      {tier === "advanced" ? "Advanced" : "Expert"} {c.index} of 3
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-display text-lg font-extrabold leading-tight">{c.title}</h4>
                  <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{c.tagline}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-bold", `bg-${c.tone}-soft text-${c.tone}`)}>
                    <Star className="h-3 w-3" /> +{c.xp} XP
                  </span>
                  <ChevronRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-1", `text-${c.tone}`)} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

/* Challenge flow */
function ChallengeFlow({
  challenge,
  isDone,
  weekId,
  onBack,
  onComplete,
}: {
  challenge: Challenge;
  isDone: boolean;
  weekId: string;
  onBack: () => void;
  onComplete: (values: Record<string, unknown>) => void;
}) {
  const existing = React.useMemo(() => getSubmission(weekId, challenge.id), [weekId, challenge.id]);
  const [values, setValues] = React.useState<Record<string, any>>(
    (existing?.values as Record<string, any>) ?? {},
  );
  const [submitted, setSubmitted] = React.useState(isDone);
  const set = (k: string, v: any) => setValues((p) => ({ ...p, [k]: v }));

  const filledCount = challenge.fields.filter((f) => {
    const v = values[f.key];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" ? v.trim().length > 0 : Boolean(v);
  }).length;
  const progress = Math.round((filledCount / challenge.fields.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: nammaEase }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All missions
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {challenge.tier === "advanced" ? "Advanced" : "Expert"} Challenge {challenge.index} of 3
          </span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: nammaEase }} className={cn("h-full rounded-full bg-gradient-to-r", `from-${challenge.tone} to-bonus`)} />
          </div>
          <span className="text-xs font-bold text-foreground">{progress}%</span>
        </div>
      </div>

      <div className={cn("relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-7 shadow-[var(--shadow-soft)]", `from-${challenge.tone}-soft via-white to-bonus-soft border-${challenge.tone}/25`)}>
        <div className={cn("pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full blur-3xl opacity-50", `bg-${challenge.tone}/30`)} />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_180px]">
          <div className="space-y-3">
            <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em]", `bg-${challenge.tone}/10 text-${challenge.tone}`)}>
              <challenge.icon className="h-3.5 w-3.5" /> {challenge.tier === "advanced" ? "Advanced Mission" : "Expert Mission"}
            </div>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{challenge.title}</h2>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">{challenge.theme}</p>
          </div>
          <div className="relative hidden h-44 items-end justify-center md:flex">
            <img src={challenge.character.image} alt={challenge.character.name} className="h-40 w-40 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {challenge.fields.map((f, i) => (
            <FieldCard key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} index={i + 1} tone={challenge.tone} />
          ))}
          <Button
            variant="hero"
            size="lg"
            onClick={() => { setSubmitted(true); onComplete(values); }}
            disabled={filledCount === 0}
            className="w-full !rounded-2xl !py-6 text-base"
          >
            {submitted ? <>Saved · re-submit <Check className="h-5 w-5" /></> : <>{challenge.ctaLabel} <ArrowRight className="h-5 w-5" /></>}
          </Button>
        </div>
        <div className="space-y-4">
          <SideCharacterCard challenge={challenge} />
          <AnimatePresence>{submitted && <FeedbackCard challenge={challenge} />}</AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function FieldCard({ field, value, onChange, index, tone }: { field: Field; value: any; onChange: (v: any) => void; index: number; tone: Challenge["tone"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all focus-within:-translate-y-0.5 focus-within:border-foreground/30 focus-within:shadow-[var(--shadow-float)]"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white", `bg-gradient-to-br from-${tone} to-${tone}/70`)}>{index}</span>
        <label className="font-display text-sm font-bold">{field.label}</label>
      </div>
      {field.type === "text" && (
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className="!rounded-xl !border-border/70 bg-white/70 !py-5 text-base" />
      )}
      {field.type === "textarea" && (
        <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={3} className="!rounded-xl !border-border/70 bg-white/70 text-base" />
      )}
      {field.type === "chips" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const arr: string[] = Array.isArray(value) ? value : [];
            const on = arr.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => onChange(on ? arr.filter((o) => o !== opt) : [...arr, opt])}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  on ? `border-${tone}/40 bg-gradient-to-br from-${tone} to-${tone}/80 text-white shadow-[var(--shadow-soft)]` : "border-border/60 bg-white/70 text-foreground/80 hover:border-foreground/30")}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {field.type === "scenario" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map((opt) => {
            const on = value === opt.id;
            return (
              <button key={opt.id} type="button" onClick={() => onChange(opt.id)}
                className={cn("group/sc relative overflow-hidden rounded-2xl border bg-white/80 p-3 text-left transition-all hover:-translate-y-0.5",
                  on ? `border-${tone}/50 ring-2 ring-${tone}/30 shadow-[var(--shadow-soft)]` : "border-border/60 hover:border-foreground/30")}>
                <div className={cn("text-[0.6rem] font-bold uppercase tracking-[0.16em]", on ? `text-${tone}` : "text-muted-foreground")}>{opt.tag}</div>
                <div className="mt-0.5 text-sm font-display font-bold leading-tight">{opt.title}</div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function SideCharacterCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-[var(--shadow-soft)]", `from-${challenge.tone}-soft to-white border-${challenge.tone}/25`)}>
      <div className={cn("pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-50", `bg-${challenge.tone}/30`)} />
      <div className="relative flex items-start gap-3">
        <img src={challenge.character.image} alt={challenge.character.name} className="h-20 w-20 shrink-0 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_12px_18px_rgba(0,0,0,0.15)]" />
        <div className="min-w-0">
          <div className={cn("text-[0.62rem] font-bold uppercase tracking-[0.16em]", `text-${challenge.tone}`)}>{challenge.character.name} is with you</div>
          <p className="mt-1 text-sm leading-5 text-foreground/85">Take your time. There are no wrong answers — only your unique creator instincts.</p>
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({ challenge }: { challenge: Challenge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: nammaEase }}
      className="relative overflow-hidden rounded-2xl border border-bonus/30 bg-gradient-to-br from-bonus-soft via-white to-challenge-soft p-5 shadow-[var(--shadow-float)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-bonus/35 blur-2xl" />
      </div>
      <div className="relative flex items-start gap-3">
        <img src={challenge.character.celebrate} alt={challenge.character.name} className="h-20 w-20 object-contain animate-[namma-float_4s_ease-in-out_infinite] drop-shadow-[0_12px_18px_rgba(0,0,0,0.15)]" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-bonus">
            <Sparkles className="h-3 w-3" /> {challenge.character.name} reacts
          </div>
          <p className="mt-1 text-sm leading-5 text-foreground/90">{challenge.feedback}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-bonus to-challenge px-3 py-1 text-[0.7rem] font-bold text-white shadow-[var(--shadow-soft)]">
            <Star className="h-3 w-3" /> +{challenge.xp} bonus XP
          </div>
        </div>
      </div>
    </motion.div>
  );
}
