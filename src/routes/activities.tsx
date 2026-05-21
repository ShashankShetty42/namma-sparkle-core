import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Cpu,
  Eye,
  Flame,
  Gift,
  Lightbulb,
  MessageCircle,
  Mic,
  PartyPopper,
  Rocket,
  Save,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";

import devExplaining from "@/assets/characters/dev-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Story & Concept · What is AI? — Namma AI" },
      {
        name: "description",
        content:
          "A magical Story & Concept lesson with Dev and Neo. Discover what Artificial Intelligence really is — through stories, analogies, examples, and playful mini quizzes.",
      },
      { property: "og:title", content: "What is AI? — A Namma AI Adventure" },
      {
        property: "og:description",
        content:
          "Step into a cinematic AI lesson with Dev and Neo, designed for Grades 5–10.",
      },
    ],
  }),
  component: StoryActivityPage,
});

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.2, 0.7, 0.3, 1] as const },
};

const pop = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, ease: [0.2, 0.7, 0.3, 1] as const },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function StoryActivityPage() {
  const [step, setStep] = React.useState(2); // current "in progress" step
  const [completed, setCompleted] = React.useState<Set<number>>(new Set([0, 1]));
  const totalSteps = 6;
  const progress = Math.round(((completed.size) / totalSteps) * 100);

  const completeStep = (i: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    setStep((s) => Math.min(totalSteps - 1, Math.max(s, i + 1)));
  };

  return (
    <AppShell>
      <div className="shell-inner">
        {/* Breadcrumb */}
        <motion.div
          {...fadeUp}
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-foreground transition-colors">Activities</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Story &amp; Concept</span>
        </motion.div>

        {/* 1. CINEMATIC HERO ------------------------------------------------ */}
        <HeroSection progress={progress} completedCount={completed.size} total={totalSteps} />

        {/* Mission status strip */}
        <MissionStrip
          progress={progress}
          step={step}
          total={totalSteps}
          completed={completed.size}
        />

        {/* 2. STORY FLOW --------------------------------------------------- */}
        <StoryFlow
          currentStep={step}
          completed={completed}
          onSelectStep={setStep}
        />

        {/* Active lesson card (concept explanation, visuals, analogy) */}
        <ConceptStage step={step} onCompleteStep={completeStep} />

        {/* Analogy cards row */}
        <AnalogySection />

        {/* Did You Know + AI Examples */}
        <KnowledgeRow />

        {/* Mini quiz */}
        <MiniQuiz onCorrect={() => completeStep(step)} />

        {/* Expandable deep concepts */}
        <DeepConcepts />

        {/* Character cheer row */}
        <CharacterChorus />

        {/* 7. CTA FLOW + next activity */}
        <BottomCTAs progress={progress} />
      </div>
    </AppShell>
  );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */

function HeroSection({
  progress,
  completedCount,
  total,
}: {
  progress: number;
  completedCount: number;
  total: number;
}) {
  return (
    <motion.section {...fadeUp} className="hero-panel relative">
      {/* Floating ambient AI visuals */}
      <FloatingVisuals />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
        {/* LEFT — copy */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="eyebrow !text-story !border-story/25 !bg-story/10">
              <BookOpen className="h-4 w-4" />
              <span>Story &amp; Concept · Week 2 · Lesson 3</span>
            </div>
            <span className="namma-streak-mini">
              <Flame className="h-3 w-3" /> 5-day streak
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="display-hero !text-4xl md:!text-5xl">
              What <span className="text-story">really</span> is{" "}
              <span className="bg-gradient-to-r from-story via-challenge to-explore bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
              ?
            </h1>
            <p className="hero-copy !text-base md:!text-lg">
              Dev is going to take you on a cinematic journey through the magical world of AI —
              with simple stories, surprising examples, and tiny brain workouts. Neo will cheer
              you on along the way.
            </p>
          </div>

          {/* Week progress + XP preview */}
          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[22px] border border-white/60 bg-white/65 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <span>Week 2 progress</span>
                <span className="text-story">{completedCount}/{total} steps</span>
              </div>
              <div className="mt-3 progress-shell !h-3">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[0.72rem] text-muted-foreground">
                <span>Lesson 3 of 5 this week</span>
                <span className="font-bold text-foreground">{progress}%</span>
              </div>
            </div>

            <div className="reward-toast bg-gradient-to-br from-xp-soft via-bonus-soft to-decide-soft border-bonus/30">
              <div className="reward-toast-badge">
                <Star className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="mini-label !text-bonus">Reward preview</div>
                <div className="reward-line !text-2xl">+80 XP</div>
                <div className="text-[0.7rem] text-muted-foreground">
                  + Explorer badge at lesson end
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">
              <Rocket className="h-4 w-4" />
              Begin the story
            </Button>
            <Button variant="soft" size="lg">
              <Bookmark className="h-4 w-4" />
              Save for later
            </Button>
          </div>
        </div>

        {/* RIGHT — illustrated banner */}
        <div className="relative">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-story-soft via-white/40 to-explore-soft p-6 shadow-[var(--shadow-float)]">
            {/* AI grid backdrop */}
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(color-mix(in_oklab,var(--story)_14%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--challenge)_14%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" />
            {/* Orbits */}
            <div className="hero-orbit left-[6%] top-[8%] h-28 w-28" />
            <div className="hero-orbit right-[8%] top-[14%] h-20 w-20" />
            <div className="hero-orbit bottom-[10%] left-[18%] h-40 w-40" />
            {/* Sparkles */}
            <div className="hero-sparkle left-[12%] top-[20%] h-2.5 w-2.5" />
            <div className="hero-sparkle right-[18%] top-[30%] h-3 w-3" />
            <div className="hero-sparkle bottom-[24%] left-[36%] h-2 w-2" />

            {/* Floating mini chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-3 top-6 flex items-center gap-2 rounded-full border border-explore/30 bg-white/85 px-3 py-1.5 text-[0.7rem] font-bold text-explore shadow-md"
            >
              <Eye className="h-3.5 w-3.5" /> Vision
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute right-3 top-20 flex items-center gap-2 rounded-full border border-bonus/30 bg-white/85 px-3 py-1.5 text-[0.7rem] font-bold text-bonus shadow-md"
            >
              <Mic className="h-3.5 w-3.5" /> Voice
            </motion.div>
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
              className="absolute bottom-10 right-6 flex items-center gap-2 rounded-full border border-challenge/30 bg-white/85 px-3 py-1.5 text-[0.7rem] font-bold text-challenge shadow-md"
            >
              <Brain className="h-3.5 w-3.5" /> Think
            </motion.div>

            {/* Dev — main character */}
            <motion.img
              src={devExplaining}
              alt="Dev explaining AI"
              className="relative z-10 mx-auto h-full w-full object-contain animate-[namma-float_5.5s_ease-in-out_infinite]"
            />

            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="absolute bottom-3 left-3 max-w-[68%] rounded-2xl rounded-bl-sm border border-story/25 bg-white/95 px-3 py-2 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)]"
            >
              <span className="mr-1 text-story">Dev:</span> Ready? Let me show you something
              wild about AI...
            </motion.div>
          </div>

          {/* Neo peeking */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -bottom-4 -right-2 hidden md:block"
          >
            <img
              src={neoHappy}
              alt="Neo cheering"
              className="h-24 w-24 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)] animate-[namma-float_4.5s_ease-in-out_infinite]"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function FloatingVisuals() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-6%] top-[10%] hidden h-40 w-40 rounded-full bg-gradient-to-br from-story/35 to-challenge/15 blur-3xl md:block"
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] bottom-[-6%] h-48 w-48 rounded-full bg-gradient-to-br from-explore/30 to-bonus/20 blur-3xl"
        animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ================================================================== */
/*  MISSION STRIP                                                      */
/* ================================================================== */

function MissionStrip({
  progress,
  step,
  total,
  completed,
}: {
  progress: number;
  step: number;
  total: number;
  completed: number;
}) {
  const items = [
    { icon: <Trophy className="h-4 w-4" />, label: "Mission", value: "Story Mode", tone: "bg-story-soft text-story" },
    { icon: <Star className="h-4 w-4" />, label: "XP earned", value: "120 / 200", tone: "bg-xp-soft text-xp" },
    { icon: <Flame className="h-4 w-4" />, label: "Streak", value: "5 days", tone: "bg-decide-soft text-decide" },
    { icon: <Zap className="h-4 w-4" />, label: "Step", value: `${step + 1} / ${total}`, tone: "bg-challenge-soft text-challenge" },
    { icon: <Check className="h-4 w-4" />, label: "Completed", value: `${completed} / ${total}`, tone: "bg-success-soft text-success" },
    { icon: <Sparkles className="h-4 w-4" />, label: "Progress", value: `${progress}%`, tone: "bg-bonus-soft text-bonus" },
  ];
  return (
    <motion.section
      {...fadeUp}
      className="section-panel !p-3 md:!p-4"
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {items.map((it) => (
          <motion.div
            key={it.label}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="stat-pill !p-3"
          >
            <span className={`stat-pill-icon !h-9 !w-9 ${it.tone}`}>{it.icon}</span>
            <div className="leading-tight">
              <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {it.label}
              </div>
              <div className="font-display text-sm font-bold text-foreground">
                {it.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/*  STORY FLOW — step-by-step learning cards                           */
/* ================================================================== */

const STORY_STEPS = [
  { icon: <Sparkles className="h-4 w-4" />, title: "Open the story", sub: "Meet Dev" },
  { icon: <Lightbulb className="h-4 w-4" />, title: "What is AI?", sub: "The big idea" },
  { icon: <Brain className="h-4 w-4" />, title: "How AI thinks", sub: "Patterns & data" },
  { icon: <Eye className="h-4 w-4" />, title: "AI in your day", sub: "Real examples" },
  { icon: <Wand2 className="h-4 w-4" />, title: "Try a mini quiz", sub: "Brain workout" },
  { icon: <PartyPopper className="h-4 w-4" />, title: "Celebrate", sub: "Claim your XP" },
];

function StoryFlow({
  currentStep,
  completed,
  onSelectStep,
}: {
  currentStep: number;
  completed: Set<number>;
  onSelectStep: (i: number) => void;
}) {
  return (
    <motion.section {...fadeUp} className="section-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="eyebrow !text-story !border-story/20 !bg-story/10">
            <BookOpen className="h-4 w-4" /> Story flow
          </div>
          <h2 className="section-title !text-2xl">Your path through the lesson</h2>
          <p className="section-copy !text-sm">
            Tap any step to jump. Dev unlocks the next part automatically as you finish.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-bold text-muted-foreground">
          <Cpu className="h-3.5 w-3.5 text-story" /> Adaptive learning path
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STORY_STEPS.map((s, i) => {
          const isDone = completed.has(i);
          const isActive = i === currentStep;
          return (
            <motion.button
              key={s.title}
              onClick={() => onSelectStep(i)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className={[
                "group relative flex flex-col items-start gap-3 rounded-[22px] border p-4 text-left transition-all",
                isActive
                  ? "border-story/40 bg-gradient-to-br from-story-soft via-white to-explore-soft shadow-[var(--shadow-float)]"
                  : isDone
                  ? "border-success/30 bg-success-soft/40"
                  : "border-border/70 bg-card/70 hover:border-primary/30",
              ].join(" ")}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    isDone
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-story text-white"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s.icon}
                </span>
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="font-display text-sm font-bold text-foreground">{s.title}</div>
                <div className="text-[0.72rem] text-muted-foreground">{s.sub}</div>
              </div>
              {isActive && (
                <motion.span
                  layoutId="story-active"
                  className="pointer-events-none absolute inset-0 rounded-[22px] ring-2 ring-story/40"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/*  CONCEPT STAGE — main interactive lesson card                       */
/* ================================================================== */

function ConceptStage({
  step,
  onCompleteStep,
}: {
  step: number;
  onCompleteStep: (i: number) => void;
}) {
  return (
    <motion.section {...fadeUp} className="section-panel relative overflow-hidden">
      {/* Soft glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-story/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-explore/12 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Dev with speech */}
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative flex w-full items-end justify-center rounded-[26px] border border-story/20 bg-gradient-to-br from-story-soft via-white to-explore-soft p-4">
            <motion.img
              key={step}
              {...pop}
              src={devThinking}
              alt="Dev thinking about AI"
              className="h-56 w-56 object-contain animate-[namma-float_6s_ease-in-out_infinite]"
            />
            {/* AI thought bubbles */}
            <motion.span
              className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-challenge/30 bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold text-challenge shadow-sm"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Brain className="h-3 w-3" /> Patterns
            </motion.span>
            <motion.span
              className="absolute right-4 top-10 inline-flex items-center gap-1 rounded-full border border-bonus/30 bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold text-bonus shadow-sm"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.4 }}
            >
              <Sparkles className="h-3 w-3" /> Data
            </motion.span>
            <motion.span
              className="absolute bottom-4 left-6 inline-flex items-center gap-1 rounded-full border border-explore/30 bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold text-explore shadow-sm"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, delay: 0.8 }}
            >
              <Eye className="h-3 w-3" /> Learn
            </motion.span>
          </div>

          <div className="character-bubble w-full !rounded-[22px] bg-gradient-to-br from-story-soft/70 to-white">
            <div className="character-avatar-shell !h-14 !w-14">
              <img src={devHappy} alt="Dev" className="character-avatar" />
            </div>
            <div className="min-w-0">
              <div className="mini-label !text-story">Dev says</div>
              <p className="speech-copy">
                AI is when computers learn to <strong>spot patterns</strong> — just like how
                you recognise your best friend in a crowd.
              </p>
            </div>
          </div>
        </div>

        {/* Concept content */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <div className="eyebrow !text-challenge !border-challenge/20 !bg-challenge/10">
                  <Lightbulb className="h-4 w-4" /> Concept · Step {step + 1}
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                  The big idea: AI learns the way you do.
                </h3>
                <p className="text-base leading-7 text-muted-foreground">
                  Imagine your brain when you first learned to recognise a cat. You saw many
                  cats, noticed patterns — pointy ears, whiskers, a tail — and then could spot
                  cats everywhere. <strong className="text-foreground">AI does the same thing</strong>,
                  just with millions of examples and a little bit of math magic.
                </p>
              </div>

              {/* Three concept pillars */}
              <div className="grid gap-3 sm:grid-cols-3">
                <Pillar
                  tone="story"
                  icon={<Eye className="h-4 w-4" />}
                  title="See"
                  body="AI looks at lots of examples — photos, words, sounds."
                />
                <Pillar
                  tone="challenge"
                  icon={<Brain className="h-4 w-4" />}
                  title="Spot patterns"
                  body="It notices what repeats and what makes things similar."
                />
                <Pillar
                  tone="bonus"
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Predict"
                  body="It guesses the next answer — and gets better each time."
                />
              </div>

              {/* Interactive visual: animated learning ladder */}
              <LearningLadder />

              <div className="flex flex-wrap gap-3 pt-1">
                <Button variant="hero" size="lg" onClick={() => onCompleteStep(step)}>
                  I got it
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="soft" size="lg">
                  <MessageCircle className="h-4 w-4" />
                  Ask Dev a question
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function Pillar({
  tone,
  icon,
  title,
  body,
}: {
  tone: "story" | "challenge" | "bonus" | "explore" | "reflect";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const toneMap: Record<string, string> = {
    story: "bg-story-soft text-story",
    challenge: "bg-challenge-soft text-challenge",
    bonus: "bg-bonus-soft text-bonus",
    explore: "bg-explore-soft text-explore",
    reflect: "bg-reflect-soft text-reflect",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-[20px] border border-border/70 bg-card/80 p-4 transition-all hover:shadow-[var(--shadow-soft)]"
    >
      <span className={`preview-icon !h-10 !w-10 ${toneMap[tone]}`}>{icon}</span>
      <div className="mt-3 font-display text-base font-bold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function LearningLadder() {
  const rungs = [
    { label: "See examples", w: "20%" },
    { label: "Notice patterns", w: "45%" },
    { label: "Make a guess", w: "70%" },
    { label: "Get feedback & improve", w: "95%" },
  ];
  return (
    <div className="rounded-[22px] border border-border/70 bg-gradient-to-br from-card/90 to-surface-2 p-5">
      <div className="flex items-center justify-between">
        <div className="mini-label">How AI gets smarter</div>
        <div className="text-[0.7rem] font-bold text-story">Live demo</div>
      </div>
      <div className="mt-4 space-y-3">
        {rungs.map((r, i) => (
          <div key={r.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
              <span>{r.label}</span>
              <span className="text-muted-foreground">{r.w}</span>
            </div>
            <div className="progress-shell !h-2.5">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                whileInView={{ width: r.w }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.15, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  ANALOGIES                                                          */
/* ================================================================== */

function AnalogySection() {
  const analogies = [
    {
      tone: "story" as const,
      emoji: "🐱",
      title: "Recognising a cat",
      body: "Your brain has seen many cats. AI looks at millions of cat photos to learn the same trick.",
    },
    {
      tone: "explore" as const,
      emoji: "🎵",
      title: "Remembering a song",
      body: "Hum two notes and you know the song. AI does that with patterns in sound waves.",
    },
    {
      tone: "bonus" as const,
      emoji: "🍳",
      title: "Following a recipe",
      body: "You repeat the steps until pancakes are perfect. AI repeats and adjusts to get better.",
    },
    {
      tone: "reflect" as const,
      emoji: "🧩",
      title: "Solving a puzzle",
      body: "You try a piece, rotate it, try again. AI guesses, checks, and learns from mistakes.",
    },
  ];
  const toneBg: Record<string, string> = {
    story: "from-story-soft to-white border-story/25",
    explore: "from-explore-soft to-white border-explore/25",
    bonus: "from-bonus-soft to-white border-bonus/25",
    reflect: "from-reflect-soft to-white border-reflect/25",
  };
  return (
    <motion.section {...fadeUp} className="section-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="eyebrow !text-reflect !border-reflect/20 !bg-reflect/10">
            <Wand2 className="h-4 w-4" /> Magical analogies
          </div>
          <h2 className="section-title !text-2xl">Think of AI like…</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analogies.map((a) => (
          <motion.article
            key={a.title}
            whileHover={{ y: -6, rotate: -0.4 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className={`relative overflow-hidden rounded-[24px] border bg-gradient-to-br p-5 ${toneBg[a.tone]}`}
          >
            <div className="text-4xl">{a.emoji}</div>
            <div className="mt-3 font-display text-lg font-bold text-foreground">{a.title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{a.body}</p>
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/*  DID YOU KNOW + AI EXAMPLES                                         */
/* ================================================================== */

function KnowledgeRow() {
  const examples = [
    { icon: <Eye className="h-4 w-4" />, title: "Camera filters", body: "AI finds your face and adds the funny dog ears in real time.", tone: "bg-explore-soft text-explore" },
    { icon: <Mic className="h-4 w-4" />, title: "Voice assistants", body: "Siri and Alexa turn your voice into text, then guess what you want.", tone: "bg-bonus-soft text-bonus" },
    { icon: <Sparkles className="h-4 w-4" />, title: "Recommendations", body: "YouTube guesses the next video you'll love based on patterns.", tone: "bg-story-soft text-story" },
    { icon: <Brain className="h-4 w-4" />, title: "Smart maps", body: "Google Maps predicts traffic by learning from millions of trips.", tone: "bg-challenge-soft text-challenge" },
  ];
  return (
    <motion.section {...fadeUp} className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      {/* Did you know */}
      <div className="section-panel relative overflow-hidden bg-gradient-to-br from-bonus-soft via-white to-xp-soft border-bonus/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-xp/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="reward-toast-badge !bg-bonus !text-white shrink-0">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <div className="eyebrow !text-bonus !border-bonus/25 !bg-bonus/10">
              <Sparkles className="h-4 w-4" /> Did you know?
            </div>
            <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">
              The word &ldquo;Artificial Intelligence&rdquo; was first used in <span className="text-bonus">1956</span>.
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              At a tiny summer workshop in the USA, a small group of scientists dreamed up a
              world where machines could <em>think and learn</em>. Almost 70 years later — here
              you are, learning all about it.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Tag tone="bonus">Origin story</Tag>
              <Tag tone="story">Fun fact</Tag>
              <Tag tone="explore">History</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* AI examples */}
      <div className="section-panel">
        <div className="space-y-2">
          <div className="eyebrow !text-explore !border-explore/20 !bg-explore/10">
            <Eye className="h-4 w-4" /> AI in real life
          </div>
          <h3 className="font-display text-xl font-extrabold text-foreground">
            You already use AI every day.
          </h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {examples.map((e) => (
            <motion.div
              key={e.title}
              whileHover={{ y: -3 }}
              className="rounded-[20px] border border-border/70 bg-card/80 p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <span className={`preview-icon !h-10 !w-10 ${e.tone}`}>{e.icon}</span>
              <div className="mt-3 font-display text-base font-bold text-foreground">{e.title}</div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{e.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Tag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "story" | "explore" | "bonus";
}) {
  const map: Record<string, string> = {
    story: "bg-story-soft text-story",
    explore: "bg-explore-soft text-explore",
    bonus: "bg-bonus-soft text-bonus",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold ${map[tone]}`}>
      {children}
    </span>
  );
}

/* ================================================================== */
/*  MINI QUIZ                                                          */
/* ================================================================== */

const QUIZ = {
  question: "Which of these is NOT a way AI usually learns?",
  options: [
    { id: "a", text: "By looking at lots of examples", correct: false },
    { id: "b", text: "By spotting patterns in data", correct: false },
    { id: "c", text: "By drinking a magical potion 🧪", correct: true },
    { id: "d", text: "By practising and getting feedback", correct: false },
  ],
};

function MiniQuiz({ onCorrect }: { onCorrect: () => void }) {
  const [picked, setPicked] = React.useState<string | null>(null);
  const correct = picked && QUIZ.options.find((o) => o.id === picked)?.correct;

  return (
    <motion.section {...fadeUp} className="section-panel relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-challenge/15 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col items-start gap-4">
          <div className="eyebrow !text-challenge !border-challenge/20 !bg-challenge/10">
            <Wand2 className="h-4 w-4" /> Mini quiz · 1 of 3
          </div>
          <h3 className="font-display text-2xl font-extrabold text-foreground">
            Quick brain workout!
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Pick the one that doesn&apos;t belong. Dev believes in you — and Neo is already
            practising the victory dance.
          </p>
          <div className="character-bubble !rounded-[22px] bg-gradient-to-br from-explore-soft/70 to-white">
            <div className="character-avatar-shell !h-14 !w-14">
              <img src={neoCelebrating} alt="Neo" className="character-avatar" />
            </div>
            <div>
              <div className="mini-label !text-explore">Neo cheers</div>
              <p className="speech-copy">You&apos;ve got this — trust your patterns!</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[22px] border border-border/70 bg-card/85 p-5">
            <div className="mini-label">Question</div>
            <p className="mt-2 font-display text-lg font-bold text-foreground md:text-xl">
              {QUIZ.question}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {QUIZ.options.map((o) => {
                const isPicked = picked === o.id;
                const showCorrect = picked !== null && o.correct;
                const showWrong = isPicked && !o.correct;
                return (
                  <motion.button
                    key={o.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (picked) return;
                      setPicked(o.id);
                      if (o.correct) onCorrect();
                    }}
                    className={[
                      "group relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                      showCorrect
                        ? "border-success/50 bg-success-soft/60"
                        : showWrong
                        ? "border-destructive/40 bg-destructive/10"
                        : "border-border/70 bg-white/80 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold uppercase",
                        showCorrect
                          ? "bg-success text-white"
                          : showWrong
                          ? "bg-destructive text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
                      ].join(" ")}
                    >
                      {showCorrect ? <Check className="h-4 w-4" /> : o.id}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{o.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={[
                  "reward-toast",
                  correct
                    ? "border-success/40 bg-success-soft/60"
                    : "border-decide/40 bg-decide-soft/60",
                ].join(" ")}
              >
                <div className="reward-toast-badge !bg-white">
                  {correct ? (
                    <Trophy className="h-5 w-5 text-success" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-decide" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-base font-bold text-foreground">
                    {correct ? "Brilliant! +20 XP unlocked" : "Almost! Try the one that feels silly 🪄"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {correct
                      ? "AI learns by examples, patterns, and feedback — never by magic potions."
                      : "Hint: AI is powerful, but it can't sip a potion to get smart."}
                  </div>
                </div>
                {correct && (
                  <Button variant="xp" size="sm">
                    Claim
                    <Gift className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/*  EXPANDABLE DEEP CONCEPTS                                           */
/* ================================================================== */

function DeepConcepts() {
  const items = [
    {
      value: "data",
      tone: "story",
      icon: <Brain className="h-4 w-4" />,
      title: "What is data?",
      body:
        "Data is just information — photos, words, numbers, sounds. AI eats data like you eat snacks: the more (and the better the quality), the smarter it gets.",
    },
    {
      value: "model",
      tone: "challenge",
      icon: <Cpu className="h-4 w-4" />,
      title: "What is a model?",
      body:
        "A model is the 'brain' AI builds after looking at lots of data. It's a giant recipe of patterns it can use to make guesses about new things.",
    },
    {
      value: "train",
      tone: "explore",
      icon: <Wand2 className="h-4 w-4" />,
      title: "What does 'training' mean?",
      body:
        "Training is when AI practises. We show it tons of examples and gently say 'yes' or 'no' until its guesses get really, really good.",
    },
    {
      value: "limit",
      tone: "decide",
      icon: <Eye className="h-4 w-4" />,
      title: "What AI can't do",
      body:
        "AI doesn't feel, dream, or truly understand the world like you. It's amazing at patterns — but kindness, creativity and curiosity? That's your superpower.",
    },
  ];
  const toneMap: Record<string, string> = {
    story: "bg-story-soft text-story",
    challenge: "bg-challenge-soft text-challenge",
    explore: "bg-explore-soft text-explore",
    decide: "bg-decide-soft text-decide",
  };
  return (
    <motion.section {...fadeUp} className="section-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="eyebrow !text-explore !border-explore/20 !bg-explore/10">
            <BookOpen className="h-4 w-4" /> Go deeper
          </div>
          <h2 className="section-title !text-2xl">Open a concept widget</h2>
          <p className="section-copy !text-sm">
            Curious? Tap a card to expand a friendly explanation written for Grades 5–10.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((it) => (
          <AccordionItem
            key={it.value}
            value={it.value}
            className="rounded-[22px] border border-border/70 bg-card/80 px-4 [&>h3]:m-0 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <span className="flex items-center gap-3">
                <span className={`preview-icon !h-10 !w-10 ${toneMap[it.tone]}`}>{it.icon}</span>
                <span className="font-display text-base font-bold text-foreground">
                  {it.title}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
              {it.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}

/* ================================================================== */
/*  CHARACTER CHORUS                                                   */
/* ================================================================== */

function CharacterChorus() {
  return (
    <motion.section
      {...fadeUp}
      className="section-panel relative overflow-hidden bg-gradient-to-br from-story-soft/60 via-white to-explore-soft/60"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-bonus/20 blur-3xl" />
      <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="flex items-end justify-center gap-4">
          <motion.img
            src={devCelebrating}
            alt="Dev celebrating"
            className="h-36 w-36 object-contain"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={neoCelebrating}
            alt="Neo celebrating"
            className="h-44 w-44 object-contain"
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </div>
        <div className="space-y-3">
          <div className="eyebrow !text-bonus !border-bonus/25 !bg-bonus/10">
            <PartyPopper className="h-4 w-4" /> You&apos;re doing amazing
          </div>
          <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Dev &amp; Neo are SO proud of you.
          </h3>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Three steps left to finish today&apos;s adventure and unlock the{" "}
            <strong className="text-bonus">Explorer badge</strong>. Keep that 5-day streak
            glowing!
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="xp" size="lg">
              <Star className="h-4 w-4" />
              Keep going
            </Button>
            <Button variant="soft" size="lg">
              <MessageCircle className="h-4 w-4" />
              Talk to Neo
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ================================================================== */
/*  BOTTOM CTAs + NEXT ACTIVITY                                        */
/* ================================================================== */

function BottomCTAs({ progress }: { progress: number }) {
  return (
    <motion.section {...fadeUp} className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      {/* Continue + Save */}
      <div className="section-panel relative overflow-hidden bg-gradient-to-br from-story-soft via-white to-challenge-soft/60 border-story/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-story/20 blur-3xl" />
        <div className="relative grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div className="space-y-3">
            <div className="eyebrow !text-story !border-story/25 !bg-story/10">
              <Rocket className="h-4 w-4" /> Continue your journey
            </div>
            <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
              You&apos;re {progress}% through this adventure.
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Save your spot or jump straight into the next part. Your streak and XP travel
              with you.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="hero" size="lg">
                Continue journey
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="soft" size="lg">
                <Save className="h-4 w-4" />
                Save progress
              </Button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-5 text-sm font-bold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
                style={{ height: "44px" }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </div>
          </div>
          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-story/25 via-bonus/15 to-explore/25 blur-2xl" />
            <img
              src={devHappy}
              alt="Dev waving"
              className="relative h-44 w-44 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {/* Next activity preview */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="section-panel relative overflow-hidden border-explore/25 bg-gradient-to-br from-explore-soft/70 via-white to-bonus-soft/60"
      >
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-explore/20 blur-3xl" />
        <div className="relative space-y-3">
          <div className="eyebrow !text-explore !border-explore/25 !bg-explore/10">
            <Sparkles className="h-4 w-4" /> Up next
          </div>
          <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">
            Explore &amp; Observe: Spot the AI
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            A playful scavenger hunt where you find AI hidden in everyday apps. Earn another{" "}
            <strong className="text-explore">+60 XP</strong>.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Tag tone="explore">Observation</Tag>
            <Tag tone="bonus">+60 XP</Tag>
          </div>
          <div className="flex items-end justify-between pt-3">
            <Button variant="default" size="lg">
              Preview activity
              <ChevronRight className="h-4 w-4" />
            </Button>
            <img
              src={neoHappy}
              alt="Neo waving"
              className="h-20 w-20 object-contain animate-[namma-float_4.8s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
