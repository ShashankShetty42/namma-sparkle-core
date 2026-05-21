import type { ReactNode } from "react";
import { type Tone, toneSoft } from "./tones";
import { cn } from "@/lib/utils";

/** Compact pill tag with a tone colour. */
export function Tag({
  tone = "story",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold",
        toneSoft[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
