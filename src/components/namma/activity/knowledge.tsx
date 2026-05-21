import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Eye, Lightbulb, Sparkles } from "lucide-react";

import { fadeUp } from "@/components/namma/motion";
import { Tag } from "./tag";
import { type Tone } from "./tones";

export type AIExample = {
  icon: ReactNode;
  title: string;
  body: string;
  tone: string; // tailwind class set, e.g. "bg-explore-soft text-explore"
};

/** Row pairing a Did-You-Know card with an AI-examples grid. */
export function KnowledgeRow({
  fact,
  examples,
}: {
  fact: {
    headline: ReactNode;
    body: string;
    tags?: { tone: Tone; label: string }[];
  };
  examples: AIExample[];
}) {
  return (
    <motion.section {...fadeUp} className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <DidYouKnowCard headline={fact.headline} body={fact.body} tags={fact.tags} />
      <AIExamplesCard items={examples} />
    </motion.section>
  );
}

export function DidYouKnowCard({
  headline,
  body,
  tags,
}: {
  headline: ReactNode;
  body: string;
  tags?: { tone: Tone; label: string }[];
}) {
  return (
    <div className="section-panel relative overflow-hidden bg-gradient-to-br from-bonus-soft via-white to-xp-soft border-bonus/20">
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-xp/20 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="reward-toast-badge !bg-bonus !text-white shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <div className="eyebrow !text-bonus !border-bonus/25 !bg-bonus/10">
            <Sparkles className="h-4 w-4" /> Did you know?
          </div>
          <h3 className="font-display text-xl font-extrabold text-foreground md:text-2xl">
            {headline}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">{body}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((t) => (
                <Tag key={t.label} tone={t.tone}>
                  {t.label}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AIExamplesCard({
  title = "You already use AI every day.",
  eyebrow = "AI in real life",
  items,
}: {
  title?: string;
  eyebrow?: string;
  items: AIExample[];
}) {
  return (
    <div className="section-panel">
      <div className="space-y-2">
        <div className="eyebrow !text-explore !border-explore/20 !bg-explore/10">
          <Eye className="h-4 w-4" /> {eyebrow}
        </div>
        <h3 className="font-display text-xl font-extrabold text-foreground">{title}</h3>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((e) => (
          <motion.div
            key={e.title}
            whileHover={{ y: -3 }}
            className="rounded-[20px] border border-border/70 bg-card/80 p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
          >
            <span className={`preview-icon !h-10 !w-10 ${e.tone}`}>{e.icon}</span>
            <div className="mt-3 font-display text-base font-bold text-foreground">
              {e.title}
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{e.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
