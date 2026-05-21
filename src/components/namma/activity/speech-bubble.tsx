import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type Tone, toneText } from "./tones";

export type SpeechBubbleProps = {
  characterImage: string;
  characterName: string;
  tone?: Tone;
  label?: string;
  children: ReactNode;
  variant?: "card" | "inline";
  className?: string;
};

/**
 * Character speech bubble. Use `variant="card"` for sectioned bubbles
 * with avatar, `variant="inline"` for compact tooltip-style bubbles.
 */
export function SpeechBubble({
  characterImage,
  characterName,
  tone = "story",
  label,
  children,
  variant = "card",
  className,
}: SpeechBubbleProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "max-w-[68%] rounded-2xl rounded-bl-sm border bg-white/95 px-3 py-2 text-xs font-semibold text-foreground shadow-[var(--shadow-soft)]",
          `border-${tone}/25`,
          className,
        )}
      >
        <span className={cn("mr-1", toneText[tone])}>{characterName}:</span>
        {children}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "character-bubble w-full !rounded-[22px] bg-gradient-to-br from-white to-white",
        className,
      )}
    >
      <div className="character-avatar-shell !h-14 !w-14">
        <img src={characterImage} alt={characterName} className="character-avatar" />
      </div>
      <div className="min-w-0">
        {label && <div className={cn("mini-label", toneText[tone])}>{label}</div>}
        <p className="speech-copy">{children}</p>
      </div>
    </div>
  );
}
