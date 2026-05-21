import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Bookmark, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/namma/motion";
import { FloatingVisuals } from "./floating-visuals";
import { XPProgressCard, RewardPreviewCard } from "./xp-widgets";
import { StreakBadge } from "./streak-badge";
import { SpeechBubble } from "./speech-bubble";
import { cn } from "@/lib/utils";

export type ActivityHeroProps = {
  /** Eyebrow text shown above the title (e.g. "Story & Concept · Week 2"). */
  eyebrow: string;
  eyebrowIcon?: ReactNode;
  /** Title — supports rich JSX for inline gradient/highlights. */
  title: ReactNode;
  /** Hero subtitle copy. */
  description: string;
  /** Main character image. */
  characterImage: string;
  characterName: string;
  /** Optional secondary character peeking in the corner. */
  secondaryCharacterImage?: string;
  secondaryCharacterName?: string;
  /** Inline speech bubble shown over the illustration. */
  speech?: string;
  /** Floating concept chips around the character. */
  floatingChips?: { icon: ReactNode; label: string; tone: "explore" | "bonus" | "challenge" | "story" | "reflect" }[];
  /** Progress + reward widgets. */
  progress: { percent: number; valueLabel: string; caption: string; label?: string };
  reward: { reward: string; subline?: string; label?: string };
  streakDays?: number;
  /** Action buttons. */
  primaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  secondaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
};

const chipTone: Record<string, string> = {
  explore: "border-explore/30 text-explore",
  bonus: "border-bonus/30 text-bonus",
  challenge: "border-challenge/30 text-challenge",
  story: "border-story/30 text-story",
  reflect: "border-reflect/30 text-reflect",
};

/**
 * Cinematic activity hero with character, progress, reward preview, and CTAs.
 * Reusable across every activity type.
 */
export function ActivityHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  characterImage,
  characterName,
  secondaryCharacterImage,
  secondaryCharacterName,
  speech,
  floatingChips = [],
  progress,
  reward,
  streakDays,
  primaryAction = { label: "Begin the story", icon: <Rocket className="h-4 w-4" /> },
  secondaryAction = { label: "Save for later", icon: <Bookmark className="h-4 w-4" /> },
}: ActivityHeroProps) {
  return (
    <motion.section {...fadeUp} className="hero-panel relative">
      <FloatingVisuals />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.25fr_1fr]">
        {/* LEFT — copy */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="eyebrow !text-story !border-story/25 !bg-story/10">
              {eyebrowIcon}
              <span>{eyebrow}</span>
            </div>
            {typeof streakDays === "number" && <StreakBadge days={streakDays} />}
          </div>

          <div className="space-y-4">
            <h1 className="display-hero !text-4xl md:!text-5xl">{title}</h1>
            <p className="hero-copy !text-base md:!text-lg">{description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
            <XPProgressCard
              label={progress.label ?? "Week progress"}
              valueLabel={progress.valueLabel}
              percent={progress.percent}
              caption={progress.caption}
            />
            <RewardPreviewCard
              label={reward.label}
              reward={reward.reward}
              subline={reward.subline}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={primaryAction.onClick}>
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
            <Button variant="soft" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.icon}
              {secondaryAction.label}
            </Button>
          </div>
        </div>

        {/* RIGHT — illustrated banner */}
        <div className="relative">
          <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-story-soft via-white/40 to-explore-soft p-6 shadow-[var(--shadow-float)]">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(color-mix(in_oklab,var(--story)_14%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--challenge)_14%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="hero-orbit left-[6%] top-[8%] h-28 w-28" />
            <div className="hero-orbit right-[8%] top-[14%] h-20 w-20" />
            <div className="hero-orbit bottom-[10%] left-[18%] h-40 w-40" />
            <div className="hero-sparkle left-[12%] top-[20%] h-2.5 w-2.5" />
            <div className="hero-sparkle right-[18%] top-[30%] h-3 w-3" />
            <div className="hero-sparkle bottom-[24%] left-[36%] h-2 w-2" />

            {floatingChips.map((chip, i) => {
              const positions = [
                "left-3 top-6",
                "right-3 top-20",
                "bottom-10 right-6",
                "bottom-20 left-4",
              ];
              return (
                <motion.div
                  key={chip.label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                  className={cn(
                    "absolute flex items-center gap-2 rounded-full border bg-white/85 px-3 py-1.5 text-[0.7rem] font-bold shadow-md",
                    chipTone[chip.tone],
                    positions[i % positions.length],
                  )}
                >
                  {chip.icon} {chip.label}
                </motion.div>
              );
            })}

            <motion.img
              src={characterImage}
              alt={characterName}
              className="relative z-10 mx-auto h-full w-full object-contain animate-[namma-float_5.5s_ease-in-out_infinite]"
            />

            {speech && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
                className="absolute bottom-3 left-3"
              >
                <SpeechBubble
                  variant="inline"
                  tone="story"
                  characterImage={characterImage}
                  characterName={characterName}
                >
                  {speech}
                </SpeechBubble>
              </motion.div>
            )}
          </div>

          {secondaryCharacterImage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-4 -right-2 hidden md:block"
            >
              <img
                src={secondaryCharacterImage}
                alt={secondaryCharacterName ?? "Helper"}
                className="h-24 w-24 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)] animate-[namma-float_4.5s_ease-in-out_infinite]"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
