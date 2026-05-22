import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Atom,
  Award,
  Brain,
  Building2,
  Check,
  ChevronRight,
  Cpu,
  Crown,
  Eye,
  Flag,
  Gavel,
  Globe2,
  GraduationCap,
  Heart,
  Lightbulb,
  Lock,
  Medal,
  Rocket,
  Scale,
  Search,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import { getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";

import neoCelebrating from "@/assets/characters/neo-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import anayaHappy from "@/assets/characters/anaya-happy.png";
import anayaExplaining from "@/assets/characters/anaya-explaining.png";
import anayaCelebrating from "@/assets/characters/anaya-celebrating.png";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Elite Challenges · Namma AI" },
      {
        name: "description",
        content:
          "Unlock advanced and expert AI creator challenges after completing your weekly adventure. Designed for Grades 7–10.",
      },
    ],
  }),
  component: ChallengesPage,
});

/* ──────────────────────────────────────────────────────────────── */
/*                           STORAGE                                */
/* ──────────────────────────────────────────────────────────────── */

const GRADE_KEY = "namma:grade";
const CHALLENGE_DONE_KEY = "namma:challenges:completed";

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
function getDoneChallenges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHALLENGE_DONE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function markChallengeDone(id: string) {
  if (typeof window === "undefined") return;
  const s = new Set(getDoneChallenges());
  s.add(id);
  window.localStorage.setItem(CHALLENGE_DONE_KEY, JSON.stringify([...s]));
  window.dispatchEvent(new CustomEvent("namma:challenges"));
}

/* ──────────────────────────────────────────────────────────────── */
/*                           CHALLENGE DATA                          */
/* ──────────────────────────────────────────────────────────────── */

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
      { type: "scenario", key: "health", label: "Healthcare in the future", options: [
        { id: "watch", title: "AI watches predict illness", tag: "Early warnings" },
        { id: "bot", title: "Robot surgeons", tag: "Precision care" },
        { id: "diet", title: "Personal nutrition AI", tag: "Custom meals" },
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
      "You're thinking like a real product creator. The way you framed users + ethics shows founder-level judgement. Investors would love this clarity.",
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
      "A thoughtful, balanced verdict. Real ethics isn't about being right — it's about who you protect and what you're willing to defend. You did both.",
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
      "Your future company is now part of the AI universe! The vision is bold, the impact is human — that's the rarest combination of all.",
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

/* ──────────────────────────────────────────────────────────────── */
/*                          PAGE                                    */
/* ──────────────────────────────────────────────────────────────── */

function ChallengesPage() {
  const [grade, setGrade] = React.useState<Grade>("7-8");
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [doneChallenges, setDoneChallenges] = React.useState<Set<string>>(new Set());
  const [active, setActive] = React.useState<Challenge | null>(null);
  const [showUnlock, setShowUnlock] = React.useState(false);
  const seenUnlockRef = React.useRef(false);

  React.useEffect(() => {
    setGrade(getGrade());
    setCompleted(new Set(getCompleted()));
    setDoneChallenges(new Set(getDoneChallenges()));
    const refresh = () => {
      setCompleted(new Set(getCompleted()));
      setDoneChallenges(new Set(getDoneChallenges()));
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
  }, []);

  const weeklyDone = completed.size >= ACTIVITY_ORDER.length;
  const tier: "advanced" | "expert" | null =
    grade === "7-8" ? "advanced" : grade === "9-10" ? "expert" : null;
  const challenges = tier === "advanced" ? ADVANCED : tier === "expert" ? EXPERT : [];

  // Cinematic unlock the first time weeklyDone+tier
  React.useEffect(() => {
    if (weeklyDone && tier && !seenUnlockRef.current) {
      const key = `namma:unlock:${tier}`;
      if (typeof window !== "undefined" && !window.localStorage.getItem(key)) {
        setShowUnlock(true);
        seenUnlockRef.current = true;
        window.localStorage.setItem(key, "1");
      }
    }
  }, [weeklyDone, tier]);

  const completeChallenge = (id: string) => {
    markChallengeDone(id);
    setDoneChallenges(new Set([...doneChallenges, id]));
  };

  return (
    <AppShell>
      <div className="shell-inner !gap-8">
        <GradePicker grade={grade} onChange={(g) => { setStoredGrade(g); setGrade(g); }} />

        {grade === "5-6" && <YoungerExplorerState />}

        {tier && !weeklyDone && <LockedState completed={completed.size} total={ACTIVITY_ORDER.length} tier={tier} />}

        {tier && weeklyDone && !active && (
          <UnlockedHub
            tier={tier}
            challenges={challenges}
            done={doneChallenges}
            onOpen={setActive}
          />
        )}

        {tier && weeklyDone && active && (
          <ChallengeFlow
            challenge={active}
            isDone={doneChallenges.has(active.id)}
            onBack={() => setActive(null)}
            onComplete={() => completeChallenge(active.id)}
          />
        )}
      </div>

      <AnimatePresence>
        {showUnlock && tier && (
          <UnlockCinematic tier={tier} onClose={() => setShowUnlock(false)} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                          GRADE PICKER                            */
/* ──────────────────────────────────────────────────────────────── */

function GradePicker({ grade, onChange }: { grade: Grade; onChange: (g: Grade) => void }) {
  const opts: { value: Grade; label: string; sub: string; icon: typeof GraduationCap }[] = [
    { value: "5-6", label: "Grades 5–6", sub: "Weekly Adventure", icon: Sparkles },
    { value: "7-8", label: "Grades 7–8", sub: "Advanced Challenges", icon: Rocket },
    { value: "9-10", label: "Grades 9–10", sub: "Expert Creator Lab", icon: Crown },
  ];
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: nammaEase }}
      className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-challenge-soft via-white to-bonus-soft p-6 shadow-[var(--shadow-soft)] md:p-8"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-challenge/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-bonus/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-challenge/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
            <Sparkles className="h-3 w-3" /> Elite Academy
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Unlock your{" "}
            <span className="bg-gradient-to-r from-challenge via-bonus to-reflect bg-clip-text text-transparent">
              creator track
            </span>
          </h1>
          <p className="max-w-lg text-sm text-muted-foreground md:text-base">
            Tell us your grade — we'll reveal the right elite missions for you.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:max-w-[480px]">
          {opts.map((o) => {
            const active = grade === o.value;
            return (
              <button
                key={o.value}
                onClick={() => onChange(o.value)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-white/80 px-4 py-3 text-left transition-all hover:-translate-y-0.5",
                  active
                    ? "border-challenge/60 shadow-[var(--shadow-float)] ring-2 ring-challenge/30"
                    : "border-border/60 hover:border-foreground/30",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl",
                      active ? "bg-gradient-to-br from-challenge to-bonus text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <o.icon className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <div className="font-display text-sm font-bold">{o.label}</div>
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {o.sub}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                    YOUNGER STATE (5-6)                           */
/* ──────────────────────────────────────────────────────────────── */

function YoungerExplorerState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-explore/25 bg-gradient-to-br from-explore-soft via-white to-story-soft p-8 shadow-[var(--shadow-soft)]"
    >
      <div className="grid items-center gap-8 md:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-explore/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-explore">
            <Heart className="h-3 w-3" /> Just for you
          </div>
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">
            Keep exploring your Weekly Adventure ✨
          </h2>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Elite Challenges open up in Grades 7–10. For now, the magic is right inside
            your 6 weekly activities — that's where the real adventure lives.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="/activities">
              Back to Weekly Adventure <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="relative hidden h-48 items-end justify-center md:flex">
          <img
            src={neoHappy}
            alt="Neo"
            className="h-44 w-44 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </motion.section>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                          LOCKED STATE                            */
/* ──────────────────────────────────────────────────────────────── */

function LockedState({
  completed,
  total,
  tier,
}: {
  completed: number;
  total: number;
  tier: "advanced" | "expert";
}) {
  const pct = Math.round((completed / total) * 100);
  const label = tier === "advanced" ? "Advanced Challenges" : "Expert Creator Lab";
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-locked/30 bg-gradient-to-br from-locked-soft via-white to-challenge-soft p-8 shadow-[var(--shadow-soft)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_30%_20%,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative grid items-center gap-8 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-locked/12 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-locked">
            <Lock className="h-3 w-3" /> Locked · keep going
          </div>
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">
            Finish your <span className="text-decide">Weekly Adventure</span> to unlock {label}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Complete all 6 weekly activities and a glowing portal will open. Inside: 3
            prestigious challenges built for creators like you.
          </p>

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

          <Button variant="hero" size="lg" asChild>
            <a href="/activities">
              Continue weekly adventure <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
        <div className="relative hidden h-56 items-end justify-center md:flex">
          <img
            src={devHappy}
            alt="Dev"
            className="h-48 w-48 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </motion.section>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                       UNLOCK CINEMATIC                           */
/* ──────────────────────────────────────────────────────────────── */

function UnlockCinematic({
  tier,
  onClose,
}: {
  tier: "advanced" | "expert";
  onClose: () => void;
}) {
  const title = tier === "advanced" ? "Advanced Challenges Unlocked!" : "Expert Creator Lab Unlocked!";
  const sub =
    tier === "advanced"
      ? "Three elite missions just opened up for you."
      : "Step into the lab — your creator universe begins now.";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md p-6"
      onClick={onClose}
    >
      {/* particles */}
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
        {/* portal ring */}
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
          Enter the Lab <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                          UNLOCKED HUB                            */
/* ──────────────────────────────────────────────────────────────── */

function UnlockedHub({
  tier,
  challenges,
  done,
  onOpen,
}: {
  tier: "advanced" | "expert";
  challenges: Challenge[];
  done: Set<string>;
  onOpen: (c: Challenge) => void;
}) {
  const totalXp = challenges.reduce((s, c) => s + c.xp, 0);
  const allDone = challenges.every((c) => done.has(c.id));
  const badge = tier === "advanced" ? "Advanced Explorer Badge" : "Future Innovator Badge";
  const title = tier === "advanced" ? "Advanced Challenges" : "Expert Creator Lab";

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: nammaEase }}
        className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-bonus-soft via-white to-challenge-soft p-8 shadow-[var(--shadow-float)]"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-bonus/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-challenge/20 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-challenge/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-challenge">
              <Sparkles className="h-3 w-3" /> {tier === "advanced" ? "For Grades 7–8" : "For Grades 9–10"}
            </div>
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
              {title}
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
              {tier === "advanced"
                ? "Three exploratory missions where you investigate, invent, and imagine. No grades, no pressure — just creative discovery."
                : "Three portfolio-worthy creator challenges. Pitch products, debate ethics, and design future companies."}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-1.5 text-xs font-bold text-xp">
                <Star className="h-3.5 w-3.5" /> {totalXp} elite XP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-bonus/30 bg-bonus-soft/70 px-3 py-1.5 text-xs font-bold text-bonus">
                <Medal className="h-3.5 w-3.5" /> {badge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-1.5 text-xs font-bold text-success">
                <Check className="h-3.5 w-3.5" /> {done.size}/{challenges.length} done
              </span>
            </div>
          </div>
          <div className="relative hidden h-56 items-end justify-center md:flex">
            <motion.img src={devCelebrating} alt="Dev" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-2 left-2 h-36 w-36 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
            <motion.img src={neoCelebrating} alt="Neo" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="relative h-48 w-48 object-contain animate-[namma-float_4.6s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]" />
            <motion.img src={anayaCelebrating} alt="Anaya" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-2 right-2 h-36 w-36 object-contain animate-[namma-float_5.2s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]" />
          </div>
        </div>
      </motion.section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Your missions
            </div>
            <h3 className="font-display text-2xl font-bold">Choose your next challenge</h3>
          </div>
          {allDone && (
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-bonus to-challenge px-3 py-1.5 text-xs font-bold text-white shadow-[var(--shadow-soft)]">
              <Crown className="h-3.5 w-3.5" /> {badge} earned
            </span>
          )}
        </div>

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
      </section>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*                       CHALLENGE FLOW                              */
/* ──────────────────────────────────────────────────────────────── */

function ChallengeFlow({
  challenge,
  isDone,
  onBack,
  onComplete,
}: {
  challenge: Challenge;
  isDone: boolean;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [submitted, setSubmitted] = React.useState(isDone);

  const set = (k: string, v: any) => setValues((p) => ({ ...p, [k]: v }));

  const filledCount = challenge.fields.filter((f) => {
    const v = values[f.key];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" ? v.trim().length > 0 : Boolean(v);
  }).length;
  const progress = Math.round((filledCount / challenge.fields.length) * 100);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: nammaEase }}
      className="space-y-6"
    >
      {/* Progress header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All missions
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {challenge.tier === "advanced" ? "Advanced" : "Expert"} Challenge {challenge.index} of 3
          </span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: nammaEase }}
              className={cn("h-full rounded-full bg-gradient-to-r", `from-${challenge.tone} to-bonus`)}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{progress}%</span>
        </div>
      </div>

      {/* Hero */}
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
            <img
              src={challenge.character.image}
              alt={challenge.character.name}
              className="h-40 w-40 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Inputs */}
        <div className="space-y-4">
          {challenge.fields.map((f, i) => (
            <FieldCard key={f.key} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} index={i + 1} tone={challenge.tone} />
          ))}

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={handleSubmit}
              disabled={filledCount === 0}
              className="w-full !rounded-2xl !py-6 text-base"
            >
              {submitted ? <>Saved · re-submit <Check className="h-5 w-5" /></> : <>{challenge.ctaLabel} <ArrowRight className="h-5 w-5" /></>}
            </Button>
          </motion.div>
        </div>

        {/* Side: character + feedback */}
        <div className="space-y-4">
          <SideCharacterCard challenge={challenge} />
          <AnimatePresence>
            {submitted && <FeedbackCard challenge={challenge} />}
          </AnimatePresence>
          {challenge.id === "exp-founder" && submitted && <FounderCard values={values} />}
          {challenge.id === "adv-helper" && submitted && <HelperBadgeCard values={values} />}
        </div>
      </div>
    </motion.section>
  );
}

/* ──────────── inputs ──────────── */

function FieldCard({
  field,
  value,
  onChange,
  index,
  tone,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
  index: number;
  tone: Challenge["tone"];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white/85 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all focus-within:-translate-y-0.5 focus-within:border-foreground/30 focus-within:shadow-[var(--shadow-float)]"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white", `bg-gradient-to-br from-${tone} to-${tone}/70`)}>
          {index}
        </span>
        <label className="font-display text-sm font-bold">{field.label}</label>
      </div>

      {field.type === "text" && (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="!rounded-xl !border-border/70 bg-white/70 !py-5 text-base"
        />
      )}
      {field.type === "textarea" && (
        <Textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="!rounded-xl !border-border/70 bg-white/70 text-base"
        />
      )}
      {field.type === "chips" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const arr: string[] = Array.isArray(value) ? value : [];
            const on = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  onChange(on ? arr.filter((o) => o !== opt) : [...arr, opt])
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  on
                    ? `border-${tone}/40 bg-gradient-to-br from-${tone} to-${tone}/80 text-white shadow-[var(--shadow-soft)]`
                    : "border-border/60 bg-white/70 text-foreground/80 hover:border-foreground/30",
                )}
              >
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
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange(opt.id)}
                className={cn(
                  "group/sc relative overflow-hidden rounded-2xl border bg-white/80 p-3 text-left transition-all hover:-translate-y-0.5",
                  on ? `border-${tone}/50 ring-2 ring-${tone}/30 shadow-[var(--shadow-soft)]` : "border-border/60 hover:border-foreground/30",
                )}
              >
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
        <img
          src={challenge.character.image}
          alt={challenge.character.name}
          className="h-20 w-20 shrink-0 object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_12px_18px_rgba(0,0,0,0.15)]"
        />
        <div className="min-w-0">
          <div className={cn("text-[0.62rem] font-bold uppercase tracking-[0.16em]", `text-${challenge.tone}`)}>
            {challenge.character.name} is with you
          </div>
          <p className="mt-1 text-sm leading-5 text-foreground/85">
            Take your time. There are no wrong answers — only your unique creator instincts.
          </p>
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
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-bonus/35 blur-2xl"
        />
      </div>
      <div className="relative flex items-start gap-3">
        <img src={challenge.character.celebrate} alt={challenge.character.name} className="h-20 w-20 object-contain animate-[namma-float_4s_ease-in-out_infinite] drop-shadow-[0_12px_18px_rgba(0,0,0,0.15)]" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-bonus">
            <Sparkles className="h-3 w-3" /> {challenge.character.name} reacts
          </div>
          <p className="mt-1 text-sm leading-5 text-foreground/90">{challenge.feedback}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-bonus to-challenge px-3 py-1 text-[0.7rem] font-bold text-white shadow-[var(--shadow-soft)]">
            <Star className="h-3 w-3" /> +{challenge.xp} elite XP
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FounderCard({ values }: { values: Record<string, any> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: nammaEase, delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl border border-challenge/30 bg-gradient-to-br from-foreground via-foreground/95 to-challenge/90 p-5 text-white shadow-[var(--shadow-float)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative">
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-bonus/90">
          Founder profile card
        </div>
        <div className="mt-2 font-display text-2xl font-extrabold leading-tight">
          {values.company || "Your Future Company"}
        </div>
        <div className="mt-1 text-xs italic text-white/80">
          {values.slogan || "A slogan that changes the world."}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[0.7rem]">
          <div className="rounded-xl bg-white/10 p-2">
            <div className="opacity-70">Industry</div>
            <div className="font-bold">{(values.industry?.[0]) || "—"}</div>
          </div>
          <div className="rounded-xl bg-white/10 p-2">
            <div className="opacity-70">Impact</div>
            <div className="font-bold line-clamp-2">{values.impact || "—"}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/70">Namma AI · Future Founder</span>
          <Crown className="h-4 w-4 text-bonus" />
        </div>
      </div>
    </motion.div>
  );
}

function HelperBadgeCard({ values }: { values: Record<string, any> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: nammaEase, delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl border border-decide/30 bg-gradient-to-br from-decide-soft via-white to-reflect-soft p-5 shadow-[var(--shadow-float)]"
    >
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-decide/25 blur-2xl" />
      <div className="relative">
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-decide">
          AI helper badge
        </div>
        <div className="mt-2 font-display text-xl font-extrabold leading-tight">
          {values.name || "Your AI Helper"}
        </div>
        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
          For: {(values.category?.[0]) || "everyone"} — {values.problem || "solving real problems"}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(values.traits ?? []).slice(0, 5).map((t: string) => (
            <span key={t} className="rounded-full bg-decide/12 px-2 py-0.5 text-[0.65rem] font-bold text-decide">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
