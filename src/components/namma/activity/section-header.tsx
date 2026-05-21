import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type Tone, toneEyebrow } from "./tones";

export type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  tone?: Tone;
  title: string;
  copy?: string;
  align?: "start" | "between";
  actions?: ReactNode;
  titleSize?: "md" | "lg";
};

/**
 * Reusable section header used at the top of every panel.
 * Pairs an optional tone-coloured eyebrow chip with a display title.
 */
export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  tone = "story",
  title,
  copy,
  align = "between",
  actions,
  titleSize = "md",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-3",
        align === "between" ? "items-end justify-between" : "items-start",
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <div className={cn("eyebrow", toneEyebrow[tone])}>
            {eyebrowIcon}
            <span>{eyebrow}</span>
          </div>
        )}
        <h2
          className={cn(
            "section-title",
            titleSize === "md" ? "!text-2xl" : "!text-3xl",
          )}
        >
          {title}
        </h2>
        {copy && <p className="section-copy !text-sm">{copy}</p>}
      </div>
      {actions}
    </div>
  );
}
