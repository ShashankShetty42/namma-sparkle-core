import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Feather,
  Gem,
  Heart,
  Lightbulb,
  MapPin,
  Mic,
  Music,
  PartyPopper,
  Pencil,
  Plus,
  Scale,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import type { Tone } from "@/components/namma/activity";
import { markCompleted, getCompleted } from "@/components/namma/activity/progress";
import { ACTIVITY_ORDER } from "@/components/namma/activity/lesson-data";
import {
  markWeekComplete,
  recordQuiz,
  rewardActivity,
  saveLessonAnswer,
} from "@/lib/namma-progress";
import { toast } from "sonner";
import {
  validateText,
  submitToBackend,
  WEEK_KEYWORDS,
  type ValidationResult,
  type ValidationTier,
} from "@/lib/namma-validation";
import {
  WritingProgress,
  NeoFeedback,
  SubmissionOverlay,
} from "@/components/namma/activity/writing-feedback";

/* ============================================================ */
/*  Types                                                        */
/* ============================================================ */

export type Phase =
  | "Story"
  | "Concept"
  | "Examples"
  | "Spot"
  | "Scenario"
  | "Decide"
  | "Reflect"
  | "Dilemma"
  | "Quiz"
  | "Celebrate";

export type Character = { name: string; image: string };

export type LessonIconName = "eye" | "brain" | "sparkles" | "camera" | "mic" | "map" | "wand" | "music" | "heart" | "lightbulb";

type CardBase = { id: string; phase: Phase; tone: Tone };

export type StoryCard = CardBase & {
  kind: "story";
  character: Character;
  partnerImage?: string;
  message: string;
  emphasis?: string;
};

export type ConceptCard = CardBase & {
  kind: "concept";
  character: Character;
  title: string;
  body: string;
  pillars: { icon: LessonIconName; title: string; body: string; tone: Tone }[];
};

export type ExamplesCard = CardBase & {
  kind: "examples";
  character: Character;
  title: string;
  intro: string;
  items: { icon: LessonIconName; title: string; body: string; tone: Tone }[];
};

export type SpotCard = CardBase & {
  kind: "spot";
  character: Character;
  prompt: string;
  helper?: string;
  slots: number;
  placeholders: string[];
  examples?: { icon?: LessonIconName; title: string; body: string; tone: Tone }[];
};

export type DecideCard = CardBase & {
  kind: "decide";
  character: Character;
  partnerImage?: string;
  title: string;
  scenario: string;
  question?: string;
  options: { id: string; text: string; tone?: Tone }[];
  reasoningLabel?: string;
  reasoningPlaceholder?: string;
};

export type ReflectCard = CardBase & {
  kind: "reflect";
  character: Character;
  title: string;
  prompt: string;
  starters?: string[];
  placeholder?: string;
  minLength?: number;
};

export type DilemmaCard = CardBase & {
  kind: "dilemma";
  character: Character;
  partnerImage?: string;
  title: string;
  scenario: string;
  question: string;
  perspectives?: { tone: Tone; label: string; body: string }[];
  options: { id: string; text: string; tone?: Tone }[];
  reasoningLabel?: string;
  reasoningPlaceholder?: string;
};

export type QuizCardData = CardBase & {
  kind: "quiz";
  character: Character;
  partnerImage?: string;
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  correctMessage: string;
  wrongMessage: string;
};

export type CelebrateCard = CardBase & {
  kind: "celebrate";
  character: Character;
  partnerImage?: string;
  title: string;
  body: string;
  reward: string;
  badgeName?: string;
  nextActivityTitle?: string;
  nextActivityHref?: string;
};

export type LessonCard =
  | StoryCard
  | ConceptCard
  | ExamplesCard
  | SpotCard
  | DecideCard
  | ReflectCard
  | DilemmaCard
  | QuizCardData
  | CelebrateCard;

export type LessonMeta = {
  weekLabel: string;
  activityNumber: number;
  title: string;
  tone: Tone;
  totalXp: number;
  badge: string;
  backHref?: string;
  nextHref?: string;
  nextTitle?: string;
};

/* ============================================================ */
/*  Frame                                                        */
/* ============================================================ */

export function LessonFrame({
  meta,
  cards,
  slug,
}: {
  meta: LessonMeta;
  cards: LessonCard[];
  slug?: string;
}) {
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [quizState, setQuizState] = React.useState<Record<string, "correct" | "wrong" | undefined>>({});
  const [quizAttempts, setQuizAttempts] = React.useState<Record<string, number>>({});
  const [answers, setAnswers] = React.useState<Record<string, { choice?: string; text?: string }>>({});
  const [attemptCount, setAttemptCount] = React.useState<Record<string, number>>({});
  const [showReward, setShowReward] = React.useState(false);
  const [submission, setSubmission] = React.useState<null | "reviewing" | "approved" | "encourage">(null);
  const [submissionMsg, setSubmissionMsg] = React.useState<string | undefined>();
  const [readingReady, setReadingReady] = React.useState<Record<string, boolean>>({});
  const [readSeconds, setReadSeconds] = React.useState(0);

  const total = cards.length;
  const card = cards[index];
  const progress = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  const ans = answers[card.id] ?? {};

  // Per-card validation tier
  const tierFor = (k: LessonCard["kind"]): ValidationTier =>
    k === "reflect" ? "reflect"
    : k === "dilemma" ? "ethics"
    : k === "decide" ? "decide"
    : "explore";

  const liveValidation: ValidationResult | null = React.useMemo(() => {
    if (card.kind === "reflect" || card.kind === "decide" || card.kind === "dilemma") {
      return validateText({
        value: ans.text ?? "",
        tier: tierFor(card.kind),
        minWords: card.kind === "reflect" ? card.minLength ? Math.max(8, Math.round(card.minLength / 5)) : undefined : undefined,
        keywords: WEEK_KEYWORDS["week-9"],
        attempt: attemptCount[card.id] ?? 0,
      });
    }
    return null;
  }, [card, ans.text, attemptCount]);

  // Story / concept / examples: reading timer (45s OR "I'm ready")
  const isReadingCard = card.kind === "story" || card.kind === "concept" || card.kind === "examples";
  React.useEffect(() => {
    setReadSeconds(0);
    if (!isReadingCard) return;
    const t = setInterval(() => setReadSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [card.id, isReadingCard]);

  const canContinue = (() => {
    switch (card.kind) {
      case "quiz":
        return quizState[card.id] === "correct" || (quizAttempts[card.id] ?? 0) >= 2;
      case "decide":
      case "dilemma":
        return !!ans.choice && !!liveValidation?.ok;
      case "reflect":
        return !!liveValidation?.ok;
      case "spot":
        return (ans.text?.split("|").filter((s) => s.trim().length > 4).length ?? 0) >= Math.min(2, card.slots);
      case "story":
      case "concept":
      case "examples":
        return readSeconds >= 12 || readingReady[card.id] === true;
      default:
        return true;
    }
  })();

  const go = (delta: 1 | -1) => {
    if (delta === 1 && !canContinue) {
      // Bump attempt counter to escalate hints
      if (card.kind === "reflect" || card.kind === "decide" || card.kind === "dilemma") {
        setAttemptCount((a) => ({ ...a, [card.id]: (a[card.id] ?? 0) + 1 }));
      }
      return;
    }
    setDirection(delta);
    if (isLast && delta === 1) {
      setShowReward(true);
      return;
    }
    setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x < -threshold) go(1);
    else if (info.offset.x > threshold && index > 0) go(-1);
  };

  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft" && index > 0) go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, canContinue]);

  return (
    <div className="shell-inner !gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={meta.backHref ?? "/activities"}
          className="group inline-flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 px-3 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:border-foreground/20 hover:bg-white"
        >
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:-translate-x-0.5", `bg-${meta.tone}-soft text-${meta.tone}`)}>
            <ArrowLeft className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {meta.weekLabel} · Activity {meta.activityNumber}
            </span>
            <span className="font-display text-base font-bold text-foreground">{meta.title}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Pill icon={<Trophy className="h-3.5 w-3.5" />} tone={meta.tone} label={meta.badge} />
          <Pill icon={<Star className="h-3.5 w-3.5" />} tone="xp" label={`+${meta.totalXp} XP`} />
        </div>

        <Link
          to="/activities"
          aria-label="Close activity"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-card/70 text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      {/* PROGRESS */}
      <ProgressBar phase={card.phase} percent={progress} step={index + 1} total={total} tone={card.tone} />

      {/* STAGE */}
      <div className="relative mx-auto w-full max-w-3xl" style={{ perspective: 1400 }}>
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
              answer={ans}
              onQuiz={(correct) => {
                setQuizState((s) => ({ ...s, [card.id]: correct ? "correct" : "wrong" }));
                if (slug) recordQuiz(slug, card.id, correct, 20);
              }}
              onAnswer={(patch) => {
                setAnswers((a) => ({ ...a, [card.id]: { ...a[card.id], ...patch } }));
                if (slug && patch.text && patch.text.trim().length > 3) {
                  saveLessonAnswer(slug, card.id, patch.text.trim());
                }
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CONTROLS */}
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <ArrowBtn dir="prev" disabled={index === 0} onClick={() => go(-1)} />
        <Dots total={total} active={index} tone={card.tone} onJump={(i) => { setDirection(i > index ? 1 : -1); setIndex(i); }} />
        <ArrowBtn dir="next" disabled={!canContinue} onClick={() => go(1)} />
      </div>

      {/* PRIMARY CTA */}
      <div className="mx-auto w-full max-w-3xl">
        <Button
          variant="hero"
          size="lg"
          disabled={!canContinue}
          onClick={() => go(1)}
          className="w-full"
        >
          {isLast ? (
            <><PartyPopper className="h-5 w-5" /> Claim your reward</>
          ) : card.kind === "quiz" && quizState[card.id] !== "correct" ? (
            <>Pick the right answer to continue</>
          ) : !canContinue ? (
            <>Complete this step to continue</>
          ) : (
            <>{ctaLabel(card.phase, cards[index + 1]?.phase)} <ChevronRight className="h-5 w-5" /></>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Tip: swipe the card, or use the arrow keys.
        </p>
      </div>

      <AnimatePresence>
        {showReward && (
          <RewardModal
            meta={meta}
            onContinue={() => {
              if (slug) {
                const isNew = rewardActivity(slug, {
                  title: meta.title,
                  badge: meta.badge,
                  xp: meta.totalXp,
                  tone: meta.tone,
                  weekId: "week-9",
                });
                markCompleted(slug);
                if (isNew) {
                  toast.success(`+${meta.totalXp} XP`, {
                    description: `${meta.badge} unlocked`,
                  });
                }
                // Weekly completion check
                const done = new Set(getCompleted());
                done.add(slug);
                if (ACTIVITY_ORDER.every((s) => done.has(s))) {
                  const newWeek = markWeekComplete("week-9");
                  if (newWeek) {
                    toast.success("Week 9 complete!", {
                      description: "+1 to your weekly streak · keep the momentum",
                    });
                  }
                }
              }
              setShowReward(false);
              if (meta.nextHref) navigate({ to: meta.nextHref });
              else navigate({ to: "/activities" });
            }}
            onClose={() => setShowReward(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================ */
/*  Primitives                                                   */
/* ============================================================ */

const cardVariants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 80, rotateY: dir * 8, scale: 0.96 }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * -80, rotateY: dir * -8, scale: 0.96 }),
};

function ctaLabel(current: Phase, next?: Phase) {
  if (!next) return "Finish";
  if (current === next) return "Next";
  return `Continue to ${next}`;
}

function Pill({ icon, tone, label }: { icon: React.ReactNode; tone: Tone; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur", `border-${tone}/30 bg-${tone}-soft/60 text-${tone}`)}>
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
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[var(--shadow-soft)] backdrop-blur transition-all",
        disabled
          ? "border-border/40 bg-card/40 text-muted-foreground/50 cursor-not-allowed"
          : "border-border/60 bg-card/80 text-foreground hover:border-foreground/30 hover:bg-white",
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
            aria-label={`Card ${i + 1}`}
            className={cn(
              "relative h-2.5 rounded-full transition-all",
              isActive ? cn("w-8", `bg-${tone}`) : isDone ? "w-2.5 bg-foreground/40" : "w-2.5 bg-muted",
            )}
          >
            {isActive && (
              <motion.span layoutId="dot-glow" className={cn("absolute inset-0 rounded-full opacity-60 blur-sm", `bg-${tone}`)} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ProgressBar({ phase, percent, step, total, tone }: { phase: string; percent: number; step: number; total: number; tone: Tone }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          <span className={cn("inline-block h-2 w-2 rounded-full", `bg-${tone}`)} />
          {phase}
          <span className="text-muted-foreground/70">· Card {step} of {total}</span>
        </div>
        <div className={cn("font-display text-sm font-bold", `text-${tone}`)}>{percent}%</div>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            tone === "story" && "from-story to-reflect",
            tone === "explore" && "from-explore to-success",
            tone === "challenge" && "from-challenge to-story",
            tone === "bonus" && "from-bonus to-decide",
            tone === "decide" && "from-decide to-bonus",
            tone === "reflect" && "from-reflect to-story",
            tone === "success" && "from-success to-explore",
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

function CardShell({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-white to-white/90 p-7 shadow-[var(--shadow-float)] md:p-10", className)}>
      <div className={cn("pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-50 blur-3xl", `bg-${tone}/40`)} />
      <div className={cn("pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full opacity-30 blur-3xl", `bg-${tone}-soft`)} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CharacterStage({ image, name, partnerImage, tone }: { image: string; name: string; partnerImage?: string; tone: Tone }) {
  return (
    <div className="relative mx-auto flex items-end justify-center">
      <div className={cn("relative flex h-56 w-56 items-end justify-center rounded-[32px] border border-white/70 p-3 md:h-64 md:w-64", `bg-gradient-to-br from-${tone}-soft via-white to-white`)}>
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

function Eyebrow({ tone, icon, label }: { tone: Tone; icon: React.ReactNode; label: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]", `bg-${tone}-soft text-${tone}`)}>
      {icon} {label}
    </div>
  );
}

/* ============================================================ */
/*  Card Renderers                                               */
/* ============================================================ */

function CardRenderer(props: {
  card: LessonCard;
  quizState?: "correct" | "wrong";
  answer: { choice?: string; text?: string };
  onQuiz: (correct: boolean) => void;
  onAnswer: (patch: { choice?: string; text?: string }) => void;
}) {
  const { card } = props;
  switch (card.kind) {
    case "story": return <StoryCardView card={card} />;
    case "concept": return <ConceptCardView card={card} />;
    case "examples": return <ExamplesCardView card={card} />;
    case "spot": return <SpotCardView card={card} answer={props.answer} onAnswer={props.onAnswer} />;
    case "decide": return <DecideCardView card={card} answer={props.answer} onAnswer={props.onAnswer} />;
    case "reflect": return <ReflectCardView card={card} answer={props.answer} onAnswer={props.onAnswer} />;
    case "dilemma": return <DilemmaCardView card={card} answer={props.answer} onAnswer={props.onAnswer} />;
    case "quiz": return <QuizCardView card={card} state={props.quizState} onAnswer={props.onQuiz} />;
    case "celebrate": return <CelebrateCardView card={card} />;
  }
}

function LessonIcon({ name, className = "h-4 w-4" }: { name?: LessonIconName; className?: string }) {
  const icons: Record<LessonIconName, React.ElementType> = {
    eye: Eye,
    brain: Brain,
    sparkles: Sparkles,
    camera: Camera,
    mic: Mic,
    map: MapPin,
    wand: Wand2,
    music: Music,
    heart: Heart,
    lightbulb: Lightbulb,
  };
  const Icon = name ? icons[name] : Sparkles;
  return <Icon className={className} />;
}

function StoryCardView({ card }: { card: StoryCard }) {
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
        <div className="space-y-4">
          <Eyebrow tone={card.tone} icon={<Sparkles className="h-3 w-3" />} label={`${card.character.name} says`} />
          <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{card.message}</h2>
          {card.emphasis && <p className={cn("font-display text-lg font-semibold", `text-${card.tone}`)}>{card.emphasis}</p>}
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
          <Eyebrow tone={card.tone} icon={<Brain className="h-3 w-3" />} label="Concept" />
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">{card.title}</h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{card.body}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {card.pillars.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }} className={cn("rounded-2xl border p-3", `border-${p.tone}/25 bg-${p.tone}-soft/40`)}>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl text-white", `bg-${p.tone}`)}><LessonIcon name={p.icon} /></div>
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
          <Eyebrow tone={card.tone} icon={<Eye className="h-3 w-3" />} label="Examples around you" />
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">{card.title}</h2>
          <p className="text-sm text-muted-foreground md:text-base">{card.intro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {card.items.map((it, i) => (
              <motion.div key={it.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }} className={cn("flex items-start gap-3 rounded-2xl border p-3", `border-${it.tone}/25 bg-${it.tone}-soft/40`)}>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white", `bg-${it.tone}`)}><LessonIcon name={it.icon} /></div>
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

function SpotCardView({ card, answer, onAnswer }: { card: SpotCard; answer: { text?: string }; onAnswer: (p: { text?: string }) => void }) {
  const values = (answer.text ?? "").split("|");
  const set = (i: number, v: string) => {
    const next = [...values];
    while (next.length < card.slots) next.push("");
    next[i] = v;
    onAnswer({ text: next.join("|") });
  };
  return (
    <CardShell tone={card.tone}>
      <div className="space-y-6">
        <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <CharacterStage image={card.character.image} name={card.character.name} tone={card.tone} />
          <div className="space-y-3">
            <Eyebrow tone={card.tone} icon={<Eye className="h-3 w-3" />} label="Spot AI around you" />
            <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{card.prompt}</h2>
            {card.helper && <p className="text-sm text-muted-foreground md:text-base">{card.helper}</p>}
          </div>
        </div>

        <div className="grid gap-3">
          {Array.from({ length: card.slots }).map((_, i) => (
            <div key={i} className="group relative">
              <span className={cn("absolute left-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-[0.7rem] font-bold text-white", `bg-${card.tone}`)}>{i + 1}</span>
              <input
                value={values[i] ?? ""}
                onChange={(e) => set(i, e.target.value)}
                placeholder={card.placeholders[i] ?? "Type what you spot…"}
                className={cn(
                  "w-full rounded-2xl border bg-white/90 py-4 pl-14 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-[var(--shadow-soft)] outline-none transition-all",
                  `border-border/60 focus:border-foreground/40`,
                )}
              />
            </div>
          ))}
        </div>

        {card.examples && (
          <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-white to-muted/30 p-5">
            <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Need inspiration? Tap to use
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {card.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const emptyIdx = Array.from({ length: card.slots }).findIndex((_, j) => !(values[j]?.trim()));
                    const targetIdx = emptyIdx >= 0 ? emptyIdx : 0;
                    set(targetIdx, ex.body);
                  }}
                  className={cn("flex items-start gap-3 rounded-2xl border bg-white/80 p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]", `border-${ex.tone}/25 hover:border-${ex.tone}/50`)}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white", `bg-${ex.tone}`)}>
                    <LessonIcon name={ex.icon} />
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-foreground">{ex.title}</div>
                    <div className="text-xs text-muted-foreground">{ex.body}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardShell>
  );
}

function OptionList({ options, picked, tone, onPick }: {
  options: { id: string; text: string; tone?: Tone }[];
  picked?: string;
  tone: Tone;
  onPick: (id: string) => void;
}) {
  return (
    <div className="grid gap-2.5">
      {options.map((o) => {
        const isPicked = picked === o.id;
        const t = o.tone ?? tone;
        return (
          <motion.button
            key={o.id}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(o.id)}
            className={cn(
              "group flex items-start gap-3 rounded-2xl border bg-card/85 px-4 py-3.5 text-left text-sm font-semibold transition-all",
              isPicked
                ? cn(`border-${t}/60 bg-${t}-soft/70 text-foreground shadow-[var(--shadow-soft)] `)
                : "border-border/60 hover:border-foreground/30 hover:bg-white",
            )}
          >
            <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase",
              isPicked ? cn(`bg-${t} text-white`) : "bg-muted text-muted-foreground group-hover:bg-foreground/10",
            )}>
              {isPicked ? <Check className="h-3.5 w-3.5" /> : o.id.toUpperCase()}
            </span>
            <span className="leading-relaxed">{o.text}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function DecideCardView({ card, answer, onAnswer }: { card: DecideCard; answer: { choice?: string; text?: string }; onAnswer: (p: { choice?: string; text?: string }) => void }) {
  return (
    <CardShell tone={card.tone}>
      <div className="space-y-6">
        <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
          <div className="space-y-3">
            <Eyebrow tone={card.tone} icon={<Scale className="h-3 w-3" />} label="You decide" />
            <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{card.title}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{card.scenario}</p>
          </div>
        </div>

        {card.question && (
          <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {card.question}
          </div>
        )}

        <OptionList options={card.options} picked={answer.choice} tone={card.tone} onPick={(id) => onAnswer({ choice: id })} />

        <AnimatePresence>
          {answer.choice && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-[var(--shadow-soft)]">
              <label className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Feather className="h-3 w-3" /> {card.reasoningLabel ?? "Why did you choose this?"}
              </label>
              <textarea
                value={answer.text ?? ""}
                onChange={(e) => onAnswer({ text: e.target.value })}
                rows={3}
                placeholder={card.reasoningPlaceholder ?? "Share your reasoning…"}
                className={cn("w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground/70 outline-none transition-all",
                  `border-border/60 focus:border-foreground/40`)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardShell>
  );
}

function DilemmaCardView({ card, answer, onAnswer }: { card: DilemmaCard; answer: { choice?: string; text?: string }; onAnswer: (p: { choice?: string; text?: string }) => void }) {
  return (
    <CardShell tone={card.tone}>
      <div className="space-y-6">
        <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
          <div className="space-y-3">
            <Eyebrow tone={card.tone} icon={<Scale className="h-3 w-3" />} label="Ethical dilemma" />
            <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{card.title}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{card.scenario}</p>
          </div>
        </div>

        {card.perspectives && (
          <div className="grid gap-3 sm:grid-cols-2">
            {card.perspectives.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className={cn("rounded-2xl border p-4", `border-${p.tone}/25 bg-${p.tone}-soft/40`)}>
                <div className={cn("text-[0.62rem] font-bold uppercase tracking-[0.22em]", `text-${p.tone}`)}>{p.label}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{p.body}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-muted/30 p-5">
          <div className="mb-3 text-sm font-display font-bold text-foreground">{card.question}</div>
          <OptionList options={card.options} picked={answer.choice} tone={card.tone} onPick={(id) => onAnswer({ choice: id })} />
        </div>

        <AnimatePresence>
          {answer.choice && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-[var(--shadow-soft)]">
              <label className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Feather className="h-3 w-3" /> {card.reasoningLabel ?? "Why do you think so?"}
              </label>
              <textarea
                value={answer.text ?? ""}
                onChange={(e) => onAnswer({ text: e.target.value })}
                rows={4}
                placeholder={card.reasoningPlaceholder ?? "There's no right or wrong answer — share your reasoning."}
                className={cn("w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground/70 outline-none transition-all",
                  `border-border/60 focus:border-foreground/40`)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardShell>
  );
}

function ReflectCardView({ card, answer, onAnswer }: { card: ReflectCard; answer: { text?: string }; onAnswer: (p: { text?: string }) => void }) {
  const text = answer.text ?? "";
  const min = card.minLength ?? 12;
  const count = text.trim().length;
  return (
    <CardShell tone={card.tone}>
      <div className="space-y-6">
        <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <CharacterStage image={card.character.image} name={card.character.name} tone={card.tone} />
          <div className="space-y-3">
            <Eyebrow tone={card.tone} icon={<Pencil className="h-3 w-3" />} label="Reflect & write" />
            <h2 className="font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{card.title}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{card.prompt}</p>
          </div>
        </div>

        {card.starters && (
          <div className="flex flex-wrap gap-2">
            {card.starters.map((s) => (
              <button
                key={s}
                onClick={() => onAnswer({ text: text ? `${text} ${s} ` : `${s} ` })}
                className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5", `border-${card.tone}/30 bg-${card.tone}-soft/50 text-${card.tone} hover:bg-${card.tone}-soft`)}
              >
                <Plus className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        )}

        <div className={cn("relative rounded-3xl border bg-gradient-to-br from-white via-white to-muted/20 p-1 shadow-[var(--shadow-soft)]", `border-${card.tone}/20`)}>
          <textarea
            value={text}
            onChange={(e) => onAnswer({ text: e.target.value })}
            rows={9}
            placeholder={card.placeholder ?? "Start writing your thoughts…"}
            className="w-full resize-none rounded-[22px] bg-transparent px-5 py-4 font-body text-base leading-7 text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-2">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Anaya is reading along
            </span>
            <span className={cn("text-xs font-bold", count >= min ? `text-${card.tone}` : "text-muted-foreground")}>
              {count} / {min}+ chars
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function QuizCardView({ card, state, onAnswer }: { card: QuizCardData; state?: "correct" | "wrong"; onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = React.useState<string | null>(null);
  React.useEffect(() => { setPicked(null); }, [card.id]);
  return (
    <CardShell tone={card.tone}>
      <div className="grid items-start gap-8 md:grid-cols-[auto_1fr]">
        <CharacterStage image={card.character.image} name={card.character.name} partnerImage={card.partnerImage} tone={card.tone} />
        <div className="space-y-5">
          <Eyebrow tone={card.tone} icon={<Wand2 className="h-3 w-3" />} label="Quick quiz" />
          <h2 className="font-display text-xl font-bold leading-snug text-foreground md:text-2xl">{card.question}</h2>
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
                    !reveal && "border-border/60 hover:border-foreground/30 hover:bg-white",
                    showCorrect && "border-success/50 bg-success-soft/60 text-success",
                    showWrong && "border-destructive/50 bg-destructive/10 text-destructive",
                    reveal && !isPicked && !opt.correct && "opacity-60",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold uppercase",
                      showCorrect ? "bg-success text-white" : showWrong ? "bg-destructive text-white" : "bg-muted text-muted-foreground group-hover:bg-foreground/10",
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
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("rounded-2xl border px-4 py-3 text-sm font-semibold",
                state === "correct" ? "border-success/40 bg-success-soft/60 text-success" : "border-destructive/40 bg-destructive/10 text-destructive")}>
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
          <Eyebrow tone={card.tone} icon={<PartyPopper className="h-3 w-3" />} label="Celebrate" />
          <h2 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">{card.title}</h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{card.body}</p>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-bonus to-xp px-4 py-3 font-display text-base font-bold text-white shadow-[var(--shadow-glow)]">
            <Star className="h-5 w-5" /> {card.reward}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ============================================================ */
/*  Reward Modal                                                 */
/* ============================================================ */

function RewardModal({ meta, onContinue, onClose }: { meta: LessonMeta; onContinue: () => void; onClose: () => void }) {
  const pieces = React.useMemo(
    () => Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 2.4 + Math.random() * 1.6,
      hue: ["#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#60a5fa", "#f59e0b"][i % 6],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
    })),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: "110vh", rotate: p.rot + 720, opacity: [0, 1, 1, 0.6, 0] }}
            transition={{ duration: p.dur, delay: p.delay, ease: "easeIn", repeat: Infinity, repeatDelay: 1.2 }}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: 0,
              width: p.size,
              height: p.size * 1.4,
              background: p.hue,
              borderRadius: 2,
            }}
          />
        ))}
      </div>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.86, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white via-white to-white/90 p-8 text-center shadow-[var(--shadow-float)]"
      >
        <div className={cn("pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-50", `bg-${meta.tone}/50`)} />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-bonus/40 blur-3xl opacity-50" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-white/70 text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative space-y-5">
          <motion.div
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}
            className={cn("relative mx-auto flex h-28 w-28 items-center justify-center rounded-[28px] shadow-[var(--shadow-glow)]", "bg-gradient-to-br from-bonus via-decide to-xp")}
          >
            <div className="absolute inset-0 animate-[namma-float_4s_ease-in-out_infinite] rounded-[28px] bg-white/0" />
            <Gem className="h-12 w-12 text-white drop-shadow-md" />
          </motion.div>

          <div>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">Badge unlocked</div>
            <h3 className="mt-1 font-display text-3xl font-extrabold text-foreground">{meta.badge}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Amazing work! You finished <strong className="text-foreground">{meta.title}</strong> and earned new XP.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-2xl border border-xp/30 bg-xp-soft/70 px-3 py-2 font-display text-sm font-bold text-xp">
              <Star className="h-4 w-4" /> +{meta.totalXp} XP
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl border border-success/30 bg-success-soft/70 px-3 py-2 font-display text-sm font-bold text-success">
              <Trophy className="h-4 w-4" /> Streak +1
            </span>
          </div>

          <Button
            variant="hero"
            size="lg"
            onClick={onContinue}
            className="w-full"
          >
            {meta.nextHref ? <>Continue to {meta.nextTitle ?? "next activity"} <ArrowRight className="h-5 w-5" /></> : <>Back to journey <ArrowRight className="h-5 w-5" /></>}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
