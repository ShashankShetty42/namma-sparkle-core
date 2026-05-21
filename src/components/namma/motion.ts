/**
 * Shared Framer Motion presets for Namma AI surfaces.
 * Keep timings/easings consistent across all activity components.
 */

export const nammaEase = [0.2, 0.7, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: nammaEase },
};

export const pop = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, ease: nammaEase },
};

export const floatY = (amp = 8, dur = 5) => ({
  animate: { y: [0, -amp, 0] },
  transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const },
});
