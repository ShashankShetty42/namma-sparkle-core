import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Journey — Namma AI" },
      { name: "description", content: "Track your learning adventure on Namma AI." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="My Journey"
        title="Your AI adventure map is loading."
        description="Soon you'll see your full learning path, completed milestones, and the next stops on your magical journey."
        character="anaya"
        tone="explore"
      />
    </AppShell>
  ),
});
