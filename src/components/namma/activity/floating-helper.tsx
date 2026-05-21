import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Tone, toneText } from "./tones";

/** Floating helper card with a character avatar + short tip. */
export function FloatingHelperCard({
  characterImage,
  characterName,
  label,
  tone = "explore",
  children,
  className,
}: {
  characterImage: string;
  characterName: string;
  label?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("namma-helper-card", className)}
    >
      <img
        src={characterImage}
        alt={characterName}
        className="h-16 w-16 shrink-0 object-contain animate-[namma-float_5s_ease-in-out_infinite]"
      />
      <div className="min-w-0">
        {label && (
          <div
            className={cn(
              "text-[0.68rem] font-bold uppercase tracking-[0.16em]",
              toneText[tone],
            )}
          >
            {label}
          </div>
        )}
        <p className="mt-1 text-xs leading-5 text-foreground/85">{children}</p>
      </div>
    </motion.div>
  );
}
