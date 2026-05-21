import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lightbulb, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp, pop } from "@/components/namma/motion";
import { SpeechBubble } from "./speech-bubble";
import { type Tone, toneSoft } from "./tones";

export type Pillar = {
  tone: Tone;
  icon: ReactNode;
  title: string;
  body: string;
};

export type ConceptStageProps = {
  /** Stable key — when it changes, the concept body animates in. */
  stepKey: string | number;
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: string;
  body: ReactNode;
  pillars?: Pillar[];
  ladder?: ReactNode;
  characterImage: string;
  characterImageThinking?: string;
  characterName: string;
  speechLabel?: string;
  speech: ReactNode;
  floatingChips?: { tone: Tone; icon: ReactNode; label: string }[];
  primaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  secondaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
};

/**
 * Interactive concept lesson card. Left: character + speech bubble.
 * Right: animated concept content (title, body, pillars, custom widget).
 */
export function ConceptStage({
  stepKey,
  eyebrow = "Concept",
  eyebrowIcon = <Lightbulb className="h-4 w-4" />,
  title,
  body,
  pillars,
  ladder,
  characterImage,
  characterImageThinking,
  characterName,
  speechLabel,
  speech,
  floatingChips = [],
  primaryAction = { label: "I got it", icon: <Check className="h-4 w-4" /> },
  secondaryAction = { label: "Ask a question", icon: <MessageCircle className="h-4 w-4" /> },
}: ConceptStageProps) {
  const thinkingImg = characterImageThinking ?? characterImage;
  const positions = [
    "left-4 top-4",
    "right-4 top-10",
    "bottom-4 left-6",
    "bottom-6 right-6",
  ];
  return (
    <motion.section {...fadeUp} className="section-panel relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-story/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-explore/12 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative flex w-full items-end justify-center rounded-[26px] border border-story/20 bg-gradient-to-br from-story-soft via-white to-explore-soft p-4">
            <motion.img
              key={stepKey}
              {...pop}
              src={thinkingImg}
              alt={`${characterName} thinking`}
              className="h-56 w-56 object-contain animate-[namma-float_6s_ease-in-out_infinite]"
            />
            {floatingChips.map((chip, i) => (
              <motion.span
                key={chip.label}
                className={`absolute ${positions[i % positions.length]} inline-flex items-center gap-1 rounded-full border bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold shadow-sm border-${chip.tone}/30 ${toneSoft[chip.tone].split(" ").find((c) => c.startsWith("text-"))}`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
              >
                {chip.icon} {chip.label}
              </motion.span>
            ))}
          </div>

          <SpeechBubble
            characterImage={characterImage}
            characterName={characterName}
            tone="story"
            label={speechLabel ?? `${characterName} says`}
            className="bg-gradient-to-br from-story-soft/70 to-white"
          >
            {speech}
          </SpeechBubble>
        </div>

        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <div className="eyebrow !text-challenge !border-challenge/20 !bg-challenge/10">
                  {eyebrowIcon} {eyebrow}
                </div>
                <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
                  {title}
                </h3>
                <div className="text-base leading-7 text-muted-foreground">{body}</div>
              </div>

              {pillars && pillars.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {pillars.map((p) => (
                    <PillarCard key={p.title} {...p} />
                  ))}
                </div>
              )}

              {ladder}

              <div className="flex flex-wrap gap-3 pt-1">
                <Button variant="hero" size="lg" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                  {primaryAction.icon}
                </Button>
                <Button variant="soft" size="lg" onClick={secondaryAction.onClick}>
                  {secondaryAction.icon}
                  {secondaryAction.label}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

export function PillarCard({ tone, icon, title, body }: Pillar) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-[20px] border border-border/70 bg-card/80 p-4 transition-all hover:shadow-[var(--shadow-soft)]"
    >
      <span className={`preview-icon !h-10 !w-10 ${toneSoft[tone]}`}>{icon}</span>
      <div className="mt-3 font-display text-base font-bold text-foreground">{title}</div>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
    </motion.div>
  );
}

/** Reusable animated "ladder" of progress rungs (e.g. AI learning steps). */
export function LearningLadder({
  title = "How AI gets smarter",
  badge = "Live demo",
  rungs,
}: {
  title?: string;
  badge?: string;
  rungs: { label: string; w: string }[];
}) {
  return (
    <div className="rounded-[22px] border border-border/70 bg-gradient-to-br from-card/90 to-surface-2 p-5">
      <div className="flex items-center justify-between">
        <div className="mini-label">{title}</div>
        <div className="text-[0.7rem] font-bold text-story">{badge}</div>
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
