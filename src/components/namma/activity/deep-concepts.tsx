import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeUp } from "@/components/namma/motion";
import { SectionHeader } from "./section-header";
import { type Tone, toneSoft } from "./tones";

export type DeepConceptItem = {
  value: string;
  tone: Tone;
  icon: ReactNode;
  title: string;
  body: ReactNode;
};

/** Grid of expandable concept widgets (accordion under the hood). */
export function DeepConcepts({
  title = "Open a concept widget",
  eyebrow = "Go deeper",
  copy = "Curious? Tap a card to expand a friendly explanation.",
  items,
}: {
  title?: string;
  eyebrow?: string;
  copy?: string;
  items: DeepConceptItem[];
}) {
  return (
    <motion.section {...fadeUp} className="section-panel">
      <SectionHeader
        tone="explore"
        eyebrow={eyebrow}
        eyebrowIcon={<BookOpen className="h-4 w-4" />}
        title={title}
        copy={copy}
      />

      <Accordion type="single" collapsible className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((it) => (
          <AccordionItem
            key={it.value}
            value={it.value}
            className="rounded-[22px] border border-border/70 bg-card/80 px-4 [&>h3]:m-0 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <span className="flex items-center gap-3">
                <span className={`preview-icon !h-10 !w-10 ${toneSoft[it.tone]}`}>{it.icon}</span>
                <span className="font-display text-base font-bold text-foreground">
                  {it.title}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
              {it.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
