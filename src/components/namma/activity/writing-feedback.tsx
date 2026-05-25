/**
 * Namma AI · Writing feedback primitives.
 *
 * Reusable, emotionally-safe writing-state UI:
 *  - <WritingProgress>     live word/char counter + glowing fill
 *  - <NeoFeedback>         soft pastel Neo speech bubble
 *  - <SubmissionOverlay>   "Neo is reviewing your thoughts…" cinematic
 *
 * Driven entirely by `ValidationResult` from `@/lib/namma-validation`.
 * Never renders harsh "wrong/error/failed" language.
 */

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Heart, Wand2, Loader2, Check, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { nammaEase } from "@/components/namma/motion";
import type { ValidationResult, ValidationLevel } from "@/lib/namma-validation";
import neoThinking from "@/assets/characters/neo-thinking.png";
import neoHappy from "@/assets/characters/neo-happy.png";
import neoCelebrating from "@/assets/characters/neo-celebrating.png";

/* ──────────────── neo art per state ──────────────── */

function neoArt(level: ValidationLevel): string {
  if (level === "excellent" || level === "ok") return neoHappy;
  if (level === "low-relevance") return neoThinking;
  return neoThinking;
}

function toneOf(level: ValidationLevel) {
  switch (level) {
    case "excellent": return "bonus";
    case "ok":        return "success";
    case "low-relevance": return "decide";
    case "spam":
    case "nonsense":
    case "short":     return "reflect";
    default:          return "story";
  }
}

/* ─────────────── WritingProgress ─────────────── */

export function WritingProgress({
  result,
  minWords,
  showWords = true,
  className,
}: {
  result: ValidationResult;
  minWords?: number;
  showWords?: boolean;
  className?: string;
}) {
  const tone = toneOf(result.level);
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("inline-block h-1.5 w-1.5 animate-pulse rounded-full", `bg-${tone}`)} />
          {labelFor(result.level)}
        </span>
        {showWords && (
          <span className={cn("font-display text-[0.7rem] font-bold", `text-${tone}`)}>
            {result.words}{minWords ? ` / ${minWords}` : ""} words
          </span>
        )}
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/70">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            tone === "bonus" && "from-bonus via-xp to-challenge shadow-[0_0_18px_rgba(255,180,80,0.45)]",
            tone === "success" && "from-success via-explore to-success",
            tone === "decide" && "from-decide via-bonus to-decide",
            tone === "reflect" && "from-reflect via-story to-reflect",
            tone === "story" && "from-story via-reflect to-story",
          )}
          initial={false}
          animate={{ width: `${result.progress}%` }}
          transition={{ duration: 0.5, ease: nammaEase }}
        />
      </div>
    </div>
  );
}

function labelFor(level: ValidationLevel) {
  switch (level) {
    case "empty":          return "Ready when you are";
    case "typing":         return "Thinking in progress…";
    case "short":          return "A little more…";
    case "spam":           return "Try different words";
    case "nonsense":       return "Take a breath";
    case "low-relevance":  return "Add this week's ideas";
    case "ok":             return "Thought submitted";
    case "excellent":      return "Beautifully reflected";
  }
}

/* ─────────────── NeoFeedback ─────────────── */

export function NeoFeedback({
  result,
  showAfterChars = 1,
  className,
}: {
  result: ValidationResult;
  /** Only show after writer has typed at least this many chars. */
  showAfterChars?: number;
  className?: string;
}) {
  const visible = result.chars >= showAfterChars;
  const tone = toneOf(result.level);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={result.message}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: nammaEase }}
          className={cn(
            "flex items-start gap-3 rounded-2xl border bg-gradient-to-br p-3 shadow-[var(--shadow-soft)]",
            `border-${tone}/25 from-${tone}-soft/70 to-white`,
            className,
          )}
        >
          <img
            src={neoArt(result.level)}
            alt="Neo"
            className="h-10 w-10 shrink-0 object-contain drop-shadow"
          />
          <div className="min-w-0 leading-tight">
            <div className={cn("flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]", `text-${tone}`)}>
              <Sparkles className="h-3 w-3" /> Neo says
            </div>
            <p className="mt-0.5 text-sm font-semibold text-foreground/90">{result.message}</p>
            {result.relevance && (result.level === "ok" || result.level === "excellent") && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip tone={tone} icon={<Heart className="h-2.5 w-2.5" />} label={`Effort · ${pillTier(result.thoughtfulness)}`} />
                <Chip tone={tone} icon={<Wand2 className="h-2.5 w-2.5" />} label={`Relevance · ${result.relevance}`} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function pillTier(score: number) {
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "growing";
}

function Chip({ tone, icon, label }: { tone: string; icon: React.ReactNode; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em]", `border-${tone}/30 bg-${tone}/10 text-${tone}`)}>
      {icon} {label}
    </span>
  );
}

/* ─────────────── SubmissionOverlay ─────────────── */

/** Cinematic "Neo is reviewing your thoughts…" overlay. */
export function SubmissionOverlay({
  open,
  state,
  message,
}: {
  open: boolean;
  state: "reviewing" | "approved" | "encourage";
  message?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.4, ease: nammaEase }}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-white via-story-soft to-bonus-soft p-7 text-center shadow-[var(--shadow-float)]"
          >
            <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-bonus/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-story/25 blur-3xl" />

            <motion.img
              src={state === "approved" ? neoCelebrating : state === "encourage" ? neoThinking : neoThinking}
              alt="Neo"
              animate={
                state === "reviewing"
                  ? { y: [0, -6, 0] }
                  : { scale: [0.9, 1.05, 1] }
              }
              transition={
                state === "reviewing"
                  ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6, ease: nammaEase }
              }
              className="relative mx-auto h-28 w-28 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)]"
            />

            <div className="relative mt-2">
              <div className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em]",
                state === "approved" ? "border-success/30 bg-success-soft/80 text-success"
                : state === "encourage" ? "border-decide/30 bg-decide-soft/80 text-decide"
                : "border-story/30 bg-story-soft/80 text-story",
              )}>
                {state === "reviewing" && <Loader2 className="h-3 w-3 animate-spin" />}
                {state === "approved" && <Check className="h-3 w-3" />}
                {state === "encourage" && <Sparkles className="h-3 w-3" />}
                {state === "reviewing" && "Neo is reviewing your thoughts"}
                {state === "approved"  && "Thought submitted"}
                {state === "encourage" && "Almost there"}
              </div>
              <p className="mt-3 font-display text-lg font-bold leading-snug text-foreground">
                {message ?? (state === "reviewing"
                  ? "Taking a moment to read your reflection…"
                  : state === "approved"
                  ? "Your ideas matter. Another step in your AI journey."
                  : "Tell me a little more.")}
              </p>
              {state === "approved" && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-bonus to-xp px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-[var(--shadow-soft)]">
                  <Star className="h-3 w-3" /> Saved + XP banked
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
