import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — Namma AI" },
      { name: "description", content: "Daily AI activities on Namma AI." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Activities"
        title="Playful AI activities, coming up."
        description="Story, Explore, Decide, Reflect, Challenge and Bonus — six magical tracks of daily AI learning."
        character="neo"
        tone="decide"
      />
    </AppShell>
  ),
});
