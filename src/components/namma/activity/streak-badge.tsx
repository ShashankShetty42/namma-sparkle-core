import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pulsing streak badge used in heroes and stat strips. */
export function StreakBadge({
  days,
  size = "sm",
  className,
}: {
  days: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <motion.span
      className={cn("namma-streak-mini", size === "md" && "px-3 py-1.5 text-sm", className)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
    >
      <motion.span
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame className={size === "md" ? "h-4 w-4" : "h-3 w-3"} />
      </motion.span>
      <span>{days}-day streak</span>
    </motion.span>
  );
}
