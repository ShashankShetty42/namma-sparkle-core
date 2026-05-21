import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Namma AI" },
      { name: "description", content: "See where you stand." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Leaderboard"
        title="Climb the magical ranks."
        description="Friendly leaderboards with class, school and global views — coming in the next phase."
        character="dev"
        tone="xp"
      />
    </AppShell>
  ),
});
