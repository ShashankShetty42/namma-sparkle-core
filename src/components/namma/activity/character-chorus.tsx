import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MessageCircle, PartyPopper, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/namma/motion";

/** Celebratory character row — primary + secondary cheering characters with CTAs. */
export function CharacterChorus({
  primaryImage,
  primaryName,
  secondaryImage,
  secondaryName,
  eyebrow = "You're doing amazing",
  title,
  body,
  primaryAction = { label: "Keep going", icon: <Star className="h-4 w-4" /> },
  secondaryAction,
}: {
  primaryImage: string;
  primaryName: string;
  secondaryImage?: string;
  secondaryName?: string;
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  primaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  secondaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
}) {
  return (
    <motion.section
      {...fadeUp}
      className="section-panel relative overflow-hidden bg-gradient-to-br from-story-soft/60 via-white to-explore-soft/60"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-bonus/20 blur-3xl" />
      <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="flex items-end justify-center gap-4">
          <motion.img
            src={primaryImage}
            alt={primaryName}
            className="h-36 w-36 object-contain"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {secondaryImage && (
            <motion.img
              src={secondaryImage}
              alt={secondaryName ?? "Helper"}
              className="h-44 w-44 object-contain"
              animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          )}
        </div>
        <div className="space-y-3">
          <div className="eyebrow !text-bonus !border-bonus/25 !bg-bonus/10">
            <PartyPopper className="h-4 w-4" /> {eyebrow}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {title}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">{body}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="xp" size="lg" onClick={primaryAction.onClick}>
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
            {secondaryAction && (
              <Button variant="soft" size="lg" onClick={secondaryAction.onClick}>
                {secondaryAction.icon ?? <MessageCircle className="h-4 w-4" />}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
