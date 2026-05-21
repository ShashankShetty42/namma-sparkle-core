/**
 * Centralised tone vocabulary for activity widgets.
 * Use these maps instead of inlining color classes per component.
 */

export type Tone =
  | "story"
  | "explore"
  | "decide"
  | "reflect"
  | "challenge"
  | "bonus"
  | "success"
  | "xp"
  | "locked";

export const toneText: Record<Tone, string> = {
  story: "text-story",
  explore: "text-explore",
  decide: "text-decide",
  reflect: "text-reflect",
  challenge: "text-challenge",
  bonus: "text-bonus",
  success: "text-success",
  xp: "text-xp",
  locked: "text-locked",
};

export const toneSoft: Record<Tone, string> = {
  story: "bg-story-soft text-story",
  explore: "bg-explore-soft text-explore",
  decide: "bg-decide-soft text-decide",
  reflect: "bg-reflect-soft text-reflect",
  challenge: "bg-challenge-soft text-challenge",
  bonus: "bg-bonus-soft text-bonus",
  success: "bg-success-soft text-success",
  xp: "bg-xp-soft text-xp",
  locked: "bg-locked-soft text-locked",
};

export const toneEyebrow: Record<Tone, string> = {
  story: "!text-story !border-story/25 !bg-story/10",
  explore: "!text-explore !border-explore/25 !bg-explore/10",
  decide: "!text-decide !border-decide/25 !bg-decide/10",
  reflect: "!text-reflect !border-reflect/25 !bg-reflect/10",
  challenge: "!text-challenge !border-challenge/25 !bg-challenge/10",
  bonus: "!text-bonus !border-bonus/25 !bg-bonus/10",
  success: "!text-success !border-success/25 !bg-success/10",
  xp: "!text-xp !border-xp/25 !bg-xp/10",
  locked: "!text-locked !border-locked/25 !bg-locked/10",
};

export const toneGradient: Record<Tone, string> = {
  story: "from-story-soft to-white border-story/25",
  explore: "from-explore-soft to-white border-explore/25",
  decide: "from-decide-soft to-white border-decide/25",
  reflect: "from-reflect-soft to-white border-reflect/25",
  challenge: "from-challenge-soft to-white border-challenge/25",
  bonus: "from-bonus-soft to-white border-bonus/25",
  success: "from-success-soft to-white border-success/25",
  xp: "from-xp-soft to-white border-xp/25",
  locked: "from-locked-soft to-white border-locked/25",
};
