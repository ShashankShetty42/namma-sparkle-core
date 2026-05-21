/**
 * Namma AI · Activity component system.
 *
 * Reusable building blocks for every activity type
 * (Story & Concept, Explore & Observe, Decide & Reflect, Challenge…).
 *
 * Architecture
 * ─────────────
 *  shared:       motion presets (`../motion`) + tone vocabulary (`./tones`)
 *  layout:       SectionHeader, FloatingVisuals
 *  hero:         ActivityHero
 *  navigation:   StoryFlow, MissionStrip
 *  content:      ConceptStage, PillarCard, LearningLadder,
 *                AnalogyGrid/AnalogyCard, KnowledgeRow, DeepConcepts
 *  gamification: QuizCard, XPProgressCard, RewardPreviewCard,
 *                AchievementToast, StreakBadge
 *  characters:   SpeechBubble, FloatingHelperCard, CharacterChorus
 *  ctas:         ContinueJourneyCard, NextActivityCard, BottomCTAs
 *  tiles:        ActivityCard, LockedState, Tag
 *
 * All components are prop-driven, tone-aware, and animation-consistent.
 */

export * from "./tones";
export * from "./section-header";
export * from "./floating-visuals";
export * from "./hero";
export * from "./mission-strip";
export * from "./story-flow";
export * from "./concept-stage";
export * from "./speech-bubble";
export * from "./analogy-card";
export * from "./knowledge";
export * from "./quiz-card";
export * from "./deep-concepts";
export * from "./character-chorus";
export * from "./cta-section";
export * from "./xp-widgets";
export * from "./streak-badge";
export * from "./floating-helper";
export * from "./locked-state";
export * from "./tag";
export * from "./activity-card";
