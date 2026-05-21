import { motion } from "framer-motion";

/** Ambient floating blurs used as hero backdrops. */
export function FloatingVisuals() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-6%] top-[10%] hidden h-40 w-40 rounded-full bg-gradient-to-br from-story/35 to-challenge/15 blur-3xl md:block"
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] bottom-[-6%] h-48 w-48 rounded-full bg-gradient-to-br from-explore/30 to-bonus/20 blur-3xl"
        animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
