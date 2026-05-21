import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/namma/motion";
import { type Tone, toneSoft } from "./tones";

export type MissionStat = {
  icon: ReactNode;
  label: string;
  value: string;
  tone: Tone;
};

/** Horizontal strip of stat pills (XP, streak, progress, etc.). */
export function MissionStrip({ items }: { items: MissionStat[] }) {
  return (
    <motion.section {...fadeUp} className="section-panel !p-3 md:!p-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {items.map((it) => (
          <motion.div
            key={it.label}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="stat-pill !p-3"
          >
            <span className={`stat-pill-icon !h-9 !w-9 ${toneSoft[it.tone]}`}>
              {it.icon}
            </span>
            <div className="leading-tight">
              <div className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {it.label}
              </div>
              <div className="font-display text-sm font-bold text-foreground">
                {it.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
