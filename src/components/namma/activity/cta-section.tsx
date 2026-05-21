import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight, Rocket, Save, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/namma/motion";
import { Tag } from "./tag";
import { type Tone } from "./tones";

export type ContinueCardProps = {
  progress: number;
  title?: ReactNode;
  body?: ReactNode;
  characterImage?: string;
  characterName?: string;
  continueLabel?: string;
  saveLabel?: string;
  backTo?: string;
  backLabel?: string;
  onContinue?: () => void;
  onSave?: () => void;
};

/** Big "continue your journey" CTA card. */
export function ContinueJourneyCard({
  progress,
  title,
  body = "Save your spot or jump straight into the next part. Your streak and XP travel with you.",
  characterImage,
  characterName = "Guide",
  continueLabel = "Continue journey",
  saveLabel = "Save progress",
  backTo = "/",
  backLabel = "Back to dashboard",
  onContinue,
  onSave,
}: ContinueCardProps) {
  return (
    <div className="section-panel relative overflow-hidden bg-gradient-to-br from-story-soft via-white to-challenge-soft/60 border-story/20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-story/20 blur-3xl" />
      <div className="relative grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div className="space-y-3">
          <div className="eyebrow !text-story !border-story/25 !bg-story/10">
            <Rocket className="h-4 w-4" /> Continue your journey
          </div>
          <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {title ?? `You're ${progress}% through this adventure.`}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">{body}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="hero" size="lg" onClick={onContinue}>
              {continueLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="soft" size="lg" onClick={onSave}>
              <Save className="h-4 w-4" />
              {saveLabel}
            </Button>
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-5 text-sm font-bold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground"
              style={{ height: "44px" }}
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </div>
        </div>
        {characterImage && (
          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-story/25 via-bonus/15 to-explore/25 blur-2xl" />
            <img
              src={characterImage}
              alt={characterName}
              className="relative h-44 w-44 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export type NextActivityCardProps = {
  title: string;
  body: ReactNode;
  tags?: { tone: Tone; label: string }[];
  characterImage?: string;
  characterName?: string;
  ctaLabel?: string;
  onPreview?: () => void;
};

/** Compact preview card for the next activity in the journey. */
export function NextActivityCard({
  title,
  body,
  tags = [],
  characterImage,
  characterName = "Guide",
  ctaLabel = "Preview activity",
  onPreview,
}: NextActivityCardProps) {
  return (
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
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
        {tags.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            {tags.map((t) => (
              <Tag key={t.label} tone={t.tone}>
                {t.label}
              </Tag>
            ))}
          </div>
        )}
        <div className="flex items-end justify-between pt-3">
          <Button variant="default" size="lg" onClick={onPreview}>
            {ctaLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
          {characterImage && (
            <img
              src={characterImage}
              alt={characterName}
              className="h-20 w-20 object-contain animate-[namma-float_4.8s_ease-in-out_infinite]"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Combo layout: ContinueJourneyCard + NextActivityCard side-by-side. */
export function BottomCTAs({
  continueProps,
  nextProps,
}: {
  continueProps: ContinueCardProps;
  nextProps: NextActivityCardProps;
}) {
  return (
    <motion.section {...fadeUp} className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <ContinueJourneyCard {...continueProps} />
      <NextActivityCard {...nextProps} />
    </motion.section>
  );
}
