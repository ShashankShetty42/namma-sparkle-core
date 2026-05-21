import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mic,
  PartyPopper,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  X,
} from "lucide-react";

import devExplaining from "@/assets/characters/dev-explaining.png";
import devHappy from "@/assets/characters/dev-happy.png";
import devThinking from "@/assets/characters/dev-thinking.png";
import devCelebrating from "@/assets/characters/dev-celebrating.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";

import { AppShell } from "@/components/namma/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import type { Tone } from "@/components/namma/activity";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Story & Concept · What is AI? — Namma AI" },
      {
        name: "description",
        content:
          "A cinematic, card-by-card Story & Concept lesson with Dev and Neo. Swipe through the story, learn the concept, try a mini quiz, and celebrate.",
      },
    ],
  }),
  component: StoryActivityPage,
});

/* ------------------------------------------------------------------ */
/*  Card definitions                                                   */
/* ------------------------------------------------------------------ */

type CardBase = {
  id: string;
  phase: "Story" | "Concept" | "Examples" | "Quiz" | "Celebrate";
  tone: Tone;
};

type StoryCard = CardBase & {
  kind: "story";
  character: { name: string; image: string };
  partnerImage?: string;
  message: string;
  emphasis?: string;
};

type ConceptCard = CardBase & {
  kind: "concept";
  title: string;
  body: string;
  character: { name: string; image: string };
  pillars: { icon: React.ReactNode; title: string; body: string; tone: Tone }[];
};

type ExamplesCard = CardBase & {
  kind: "examples";
  title: string;
  intro: string;
  character: { name: string; image: string };
  items: { icon: React.ReactNode; title: string; body: string; tone: Tone }[];
};

type QuizCardData = CardBase & {
  kind: "quiz";
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  character: { name: string; image: string };
  partnerImage?: string;
  correctMessage: string;
  wrongMessage: string;
};

type CelebrateCard = CardBase & {
  kind: "celebrate";
  title: string;
  body: string;
  reward: string;
  character: { name: string; image: string };
  partnerImage?: string;
};

type LessonCard = StoryCard | ConceptCard | ExamplesCard | QuizCardData | CelebrateCard;

const CARDS: LessonCard[] = [
  {
    id: "story-1",
    kind: "story",
    phase: "Story",
    tone: "story",
    character: { name: "Dev", image: devExplaining },
    partnerImage: neoHappy,
    message:
      "Hey! Have you ever wondered how your phone knows what you want to type next? Or how Netflix picks the perfect movie for you?",
    emphasis: "Today we'll find out — together.",
  },
  {
    id: "story-2",
    kind: "story",
    phase: "Story",
    tone: "explore",
    character: { name: "Neo", image: neoExplaining },
    partnerImage: devHappy,
    message:
      "That's all Artificial Intelligence! AI is like giving computers the ability to learn and make decisions, just like humans do — but using data and patterns!",
  },
  {
    id: "story-3",
    kind: "story",
    phase: "Story",
    tone: "bonus",
    character: { name: "Dev", image: devHappy },
    partnerImage: neoCelebrating,
    message:
      "Wow, so AI is everywhere around us? In our phones, in games, even in hospitals? That's amazing — and a little magical too!",
  },
  {
    id: "concept-1",
    kind: "concept",
    phase: "Concept",
    tone: "challenge",
    title: "What is Artificial Intelligence?",
    body:
      "AI is a branch of computer science that helps machines learn from experience, adjust to new things, and do tasks that usually need human intelligence.",
    character: { name: "Dev", image: devThinking },
    pillars: [
      { tone: "story", icon: <Eye className="h-4 w-4" />, title: "See", body: "Looks at lots of examples" },
      { tone: "challenge", icon: <Brain className="h-4 w-4" />, title: "Spot patterns", body: "Notices what repeats" },
      { tone: "bonus", icon: <Sparkles className="h-4 w-4" />, title: "Predict", body: "Guesses the next answer" },
    ],
  },
  {
    id: "examples-1",
    kind: "examples",
    phase: "Examples",
    tone: "explore",
    title: "AI is already in your day",
    intro: "You probably use AI every single day — without even noticing it.",
    character: { name: "Neo", image: neoHappy },
    items: [
      { tone: "explore", icon: <Eye className="h-4 w-4" />, title: "Camera filters", body: "Finds your face in real time" },
      { tone: "bonus", icon: <Mic className="h-4 w-4" />, title: "Voice assistants", body: "Siri & Alexa understand you" },
      { tone: "story", icon: <Sparkles className="h-4 w-4" />, title: "Recommendations", body: "YouTube picks the next video" },
      { tone: "challenge", icon: <Brain className="h-4 w-4" />, title: "Smart maps", body: "Predict traffic instantly" },
    ],
  },
  {
    id: "quiz-1",
    kind: "quiz",
    phase: "Quiz",
    tone: "challenge",
    question: "Which of these is NOT a way AI usually learns?",
    options: [
      { id: "a", text: "By looking at lots of examples", correct: false },
      { id: "b", text: "By spotting patterns in data", correct: false },
      { id: "c", text: "By drinking a magical potion 🧪", correct: true },
      { id: "d", text: "By practising and getting feedback", correct: false },
    ],
    character: { name: "Dev", image: devThinking },
    partnerImage: neoHappy,
    correctMessage: "Brilliant! AI learns from data, patterns and feedback — never magic.",
    wrongMessage: "Almost — pick the one that feels a little silly. AI can't sip potions!",
  },
  {
    id: "celebrate-1",
    kind: "celebrate",
    phase: "Celebrate",
    tone: "success",
    title: "You did it!",
    body: "You finished the Story & Concept adventure. Dev and Neo are SO proud of you.",
    reward: "+120 XP · Explorer badge unlocked",
    character: { name: "Dev", image: devCelebrating },
    partnerImage: neoCelebrating,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function StoryActivityPage() {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [quizState, setQuizState] = React.useState<Record<string, "correct" | "wrong" | undefined>>({});

  const total = CARDS.length;
  const card = CARDS[index];
  const progress = Math.round(((index + 1) / total) * 100);

  const canGoNext =
    card.kind === "quiz" ? quizState[card.id] === "correct" : index < total - 1;
  const canGoPrev = index > 0;

  const go = (delta: 1 | -1) => {
    setDirection(delta);
    setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x < -threshold && canGoNext) go(1);
    else if (info.offset.x > threshold && canGoPrev) go(-1);
  };

  const isLast = index === total - 1;

  return (
    <AppShell>
      <div className="shell-inner !gap-6">
        {/* HEADER ROW */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-3 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:border-story/40 hover:bg-story-soft/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-story-soft text-story transition-transform group-hover:-translate-x-0.5">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Week 9 · Activity 1
              </span>
              <span className="font-display text-base font-bold text-foreground">
                Story &amp; Concept
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Badge icon={<Trophy className="h-3.5 w-3.5" />} tone="story" label="Story Mode" />
            <Badge icon={<Star className="h-3.5 w-3.5" />} tone="xp" label="120 / 200 XP" />
          </div>

          <Link
            to="/"
            aria-label="Close activity"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-card/70 text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {/* PROGRESS */}
        <ProgressBar phase={card.phase} percent={progress} step={index + 1} total={total} tone={card.tone} />

        {/* CARD STAGE */}
        <div
          className="relative mx-auto w-full max-w-3xl"
          style={{ perspective: 1400 }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={card.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: nammaEase }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <CardRenderer
                card={card}
                quizState={quizState[card.id]}
                onAnswer={(correct) =>
                  setQuizState((s) => ({ ...s, [card.id]: correct ? "correct" : "wrong" }))
                }
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CONTROLS */}
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <ArrowBtn dir="prev" disabled={!canGoPrev} onClick={() => go(-1)} />
          <Dots total={total} active={index} tone={card.tone} onJump={(i) => { setDirection(i > index ? 1 : -1); setIndex(i); }} />
          <ArrowBtn dir="next" disabled={!canGoNext} onClick={() => go(1)} />
        </div>

        {/* PRIMARY CTA */}
        <div className="mx-auto w-full max-w-3xl">
          <Button
            variant="hero"
            size="xl"
            disabled={!isLast && !canGoNext}
            onClick={() => {
              if (isLast) return;
              go(1);
            }}
            className="w-full"
          >
            {isLast ? (
              <>
                <PartyPopper className="h-5 w-5" /> Claim your reward
              </>
            ) : card.kind === "quiz" && quizState[card.id] !== "correct" ? (
              <>Pick the right answer to continue</>
            ) : (
              <>
                {ctaLabel(card.phase, CARDS[index + 1]?.phase)}
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Tip: swipe left or right on the card, or use the arrow keys.
          </p>
        </div>
      </div>

      {/* keyboard nav */}
      <KeyboardNav onPrev={() => canGoPrev && go(-1)} onNext={() => canGoNext && go(1)} />
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const cardVariants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 80, rotateY: dir * 8, scale: 0.96 }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * -80, rotateY: dir * -8, scale: 0.96 }),
};

function ctaLabel(current: LessonCard["phase"], next?: LessonCard["phase"]) {
  if (!next) return "Finish";
  if (current === next) return "Next";
  return `Continue to ${next}`;
}

function ProgressBar({
  phase,
  percent,
  step,
  total,
  tone,
}: {
  phase: string;
  percent: number;
  step: number;
  total: number;
  tone: Tone;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          <span className={cn("inline-block h-2 w-2 rounded-full", `bg-${tone}`)} />
          Week 9 — {phase}
          <span className="text-muted-foreground/70">· Card {step} of {total}</span>
        </div>
        <div className={cn("font-display text-sm font-bold", `text-${tone}`)}>{percent}%</div>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            tone === "story" && "from-story to-explore",
            tone === "explore" && "from-explore to-bonus",
            tone === "challenge" && "from-challenge to-story",
            tone === "bonus" && "from-bonus to-challenge",
            tone === "success" && "from-success to-explore",
            tone === "decide" && "from-decide to-bonus",
            tone === "reflect" && "from-reflect to-story",
            tone === "xp" && "from-xp to-bonus",
            tone === "locked" && "from-locked to-muted",
          )}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: nammaEase }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.5)_0_6px,transparent_6px_12px)]" />
      </div>
    </div>
  );
}

function Badge({ icon, tone, label }: { icon: React.ReactNode; tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur",
        `border-${tone}/30 bg-${tone}-soft/60 text-${tone}`,
      )}
    >
      {icon} {label}
    </span>
  );
}

function ArrowBtn({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled?: boolean; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.06 }}
      whileTap={{ scale: disabled ? 1 : 0.94 }}
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous card" : "Next card"}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[var(--shadow-soft)] backdrop-blur transition-all",
        disabled
          ? "border-border/40 bg-card/40 text-muted-foreground/50 cursor-not-allowed"
          : "border-border/60 bg-card/80 text-foreground hover:border-story/40 hover:bg-story-soft/60 hover:text-story",
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
}

function Dots({ total, active, tone, onJump }: { total: number; active: number; tone: Tone; onJump: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        const isDone = i < active;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            aria-label={`Go to card ${i + 1}`}
            className={cn(
              "relative h-2.5 rounded-full transition-all",
              isActive ? cn("w-8", `bg-${tone}`) : isDone ? "w-2.5 bg-foreground/40" : "w-2.5 bg-muted",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="dot-glow"
                className={cn("absolute inset-0 rounded-full opacity-60 blur-sm", `bg-${tone}`)}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function KeyboardNav({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight" || e.key === "Enter") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onPrev, onNext]);
  return null;
}

/* ------------------------------------------------------------------ */
/*  Card renderers                                                     */
/* ------------------------------------------------------------------ */

function CardRenderer({
  card,
  quizState,
  onAnswer,
}: {
  card: LessonCard;
  quizState?: "correct" | "wrong";
  onAnswer: (correct: boolean) => void;
}) {
  switch (card.kind) {
    case "story":
      return <StoryCardView card={card} />;
    case "concept":
      return <ConceptCardView card={card} />;
    case "examples":
      return <ExamplesCardView card={card} />;
    case "quiz":
      return <QuizCardView card={card} state={quizState} onAnswer={onAnswer} />;
    case "celebrate":
      return <CelebrateCardView card={card} />;
  }
}

function CardShell({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-white to-white/90 p-7 shadow-[var(--shadow-float)] md:p-10",
        className,
      )}
    >
      {/* tone glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-50 blur-3xl",
          `bg-${tone}/40`,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full opacity-30 blur-3xl",
          `bg-${tone}-soft`,
        )}
      />
      {/* grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CharacterStage({
  image,
  name,
  partnerImage,
  tone,
}: {
  image: string;
  name: string;
  partnerImage?: string;
  tone: Tone;
}) {
  return (
    <div className="relative mx-auto flex items-end justify-center">
      <div
        className={cn(
          "relative flex h-56 w-56 items-end justify-center rounded-[32px] border border-white/70 p-3 md:h-64 md:w-64",
          `bg-gradient-to-br from-${tone}-soft via-white to-white`,
        )}
      >
        <div className={cn("absolute inset-4 rounded-[24px] opacity-50", `bg-${tone}/10`)} />
        <motion.img
          key={image}
          src={image}
          alt={name}
          initial={{ y: 12, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: nammaEase }}
          className="relative h-full w-full object-contain animate-[namma-float_5s_ease-in-out_infinite] drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
        />
        {/* sparkles */}
        <Sparkles className={cn("absolute -top-3 -right-2 h-5 w-5", `text-${tone}`)} />
        <Sparkles className={cn("absolute bottom-4 -left-3 h-4 w-4 opacity-70", `text-${tone}`)} />
      </div>

      {partnerImage && (
        <motion.img
          src={partnerImage}
          alt="partner"
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="absolute -right-4 -bottom-2 hidden h-24 w-24 object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.16)] animate-[namma-float_4.5s_ease-in-out_infinite] sm:block"
        />
      )}
    </div>
  );
}

function StoryCardView({ card }: { card: StoryCard }) {
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
        <div className="space-y-4">
          <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]",
            `bg-${card.tone}-soft text-${card.tone}`,
          )}>
            <Sparkles className="h-3 w-3" /> {card.character.name} says
          </div>
          <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">
            {card.message}
          </h2>
          {card.emphasis && (
            <p className={cn("font-display text-lg font-semibold", `text-${card.tone}`)}>
              {card.emphasis}
            </p>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function ConceptCardView({ card }: { card: ConceptCard }) {
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} tone={card.tone} />
        <div className="space-y-5">
          <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]",
            `bg-${card.tone}-soft text-${card.tone}`,
          )}>
            <Brain className="h-3 w-3" /> Concept
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {card.title}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{card.body}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {card.pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                className={cn(
                  "rounded-2xl border p-3",
                  `border-${p.tone}/25 bg-${p.tone}-soft/40`,
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl text-white", `bg-${p.tone}`)}>
                  {p.icon}
                </div>
                <div className="mt-2 font-display text-sm font-bold text-foreground">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function ExamplesCardView({ card }: { card: ExamplesCard }) {
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} tone={card.tone} />
        <div className="space-y-5">
          <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]",
            `bg-${card.tone}-soft text-${card.tone}`,
          )}>
            <Eye className="h-3 w-3" /> Examples around you
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {card.title}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">{card.intro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {card.items.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-3",
                  `border-${it.tone}/25 bg-${it.tone}-soft/40`,
                )}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white", `bg-${it.tone}`)}>
                  {it.icon}
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-foreground">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function QuizCardView({
  card,
  state,
  onAnswer,
}: {
  card: QuizCardData;
  state?: "correct" | "wrong";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
        <div className="space-y-5">
          <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]",
            `bg-${card.tone}-soft text-${card.tone}`,
          )}>
            <Wand2 className="h-3 w-3" /> Mini quiz
          </div>
          <h2 className="font-display text-xl font-bold leading-snug text-foreground md:text-2xl">
            {card.question}
          </h2>
          <div className="grid gap-2.5">
            {card.options.map((opt) => {
              const isPicked = picked === opt.id;
              const reveal = state !== undefined;
              const showCorrect = reveal && opt.correct;
              const showWrong = reveal && isPicked && !opt.correct;
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ x: reveal ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (state === "correct") return;
                    setPicked(opt.id);
                    onAnswer(opt.correct);
                  }}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-2xl border bg-card/80 px-4 py-3 text-left text-sm font-semibold transition-all",
                    !reveal && "border-border/60 hover:border-challenge/40 hover:bg-challenge-soft/40",
                    showCorrect && "border-success/50 bg-success-soft/60 text-success",
                    showWrong && "border-destructive/50 bg-destructive/10 text-destructive",
                    reveal && !isPicked && !opt.correct && "opacity-60",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold uppercase",
                      showCorrect ? "bg-success text-white"
                        : showWrong ? "bg-destructive text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-challenge group-hover:text-white",
                    )}>
                      {showCorrect ? <Check className="h-3.5 w-3.5" /> : showWrong ? <X className="h-3.5 w-3.5" /> : opt.id}
                    </span>
                    {opt.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {state && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-semibold",
                  state === "correct"
                    ? "border-success/40 bg-success-soft/60 text-success"
                    : "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                {state === "correct" ? card.correctMessage : card.wrongMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CardShell>
  );
}

function CelebrateCardView({ card }: { card: CelebrateCard }) {
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
        <div className="space-y-5">
          <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]",
            `bg-${card.tone}-soft text-${card.tone}`,
          )}>
            <PartyPopper className="h-3 w-3" /> Celebrate
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {card.title}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{card.body}</p>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-bonus to-xp px-4 py-3 font-display text-base font-bold text-white shadow-[var(--shadow-glow)]">
            <Star className="h-5 w-5" /> {card.reward}
          </div>
        </div>
      </div>
    </CardShell>
  );
}
