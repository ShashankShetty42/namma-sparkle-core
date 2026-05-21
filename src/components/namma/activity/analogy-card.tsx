import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";

import { fadeUp } from "@/components/namma/motion";
import { SectionHeader } from "./section-header";
import { type Tone, toneGradient } from "./tones";

export type Analogy = {
  tone: Tone;
  emoji: string;
  title: string;
  body: string;
};

/** Grid of magical analogy cards. */
export function AnalogyGrid({
  title = "Think of AI like…",
  eyebrow = "Magical analogies",
  items,
}: {
  title?: string;
  eyebrow?: string;
  items: Analogy[];
}) {
  return (
    <motion.section {...fadeUp} className="section-panel">
      <SectionHeader
        tone="reflect"
        eyebrow={eyebrow}
        eyebrowIcon={<Wand2 className="h-4 w-4" />}
        title={title}
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((a) => (
          <AnalogyCard key={a.title} {...a} />
        ))}
      </div>
    </motion.section>
  );
}

export function AnalogyCard({ tone, emoji, title, body }: Analogy) {
  return (
    <motion.article
      whileHover={{ y: -6, rotate: -0.4 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={`relative overflow-hidden rounded-[24px] border bg-gradient-to-br p-5 ${toneGradient[tone]}`}
    >
      <div className="text-4xl">{emoji}</div>
      <div className="mt-3 font-display text-lg font-bold text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
    </motion.article>
  );
}
