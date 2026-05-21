import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import anayaHappy from "@/assets/characters/anaya-happy.png";
import devExplaining from "@/assets/characters/dev-explaining.png";
import neoExplaining from "@/assets/characters/neo-explaining.png";

const characterMap = {
  neo: neoExplaining,
  dev: devExplaining,
  anaya: anayaHappy,
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  character = "neo",
  tone = "story",
}: {
  eyebrow: string;
  title: string;
  description: string;
  character?: "neo" | "dev" | "anaya";
  tone?: "story" | "explore" | "decide" | "reflect" | "challenge" | "bonus" | "xp";
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="hero-panel"
    >
      <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <div className={`eyebrow !text-${tone} !border-${tone}/20 !bg-${tone}/10`}>
            <Sparkles className="h-4 w-4" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="display-hero !text-3xl md:!text-5xl">{title}</h1>
          <p className="hero-copy">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero">Coming soon</Button>
            <Button variant="soft">Preview design system</Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 via-explore/15 to-bonus/20 blur-2xl" />
          <img
            src={characterMap[character]}
            alt={character}
            className="relative h-64 w-64 object-contain animate-[namma-float_5.5s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </motion.section>
  );
}
