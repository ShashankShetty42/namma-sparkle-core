import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Namma AI" },
      { name: "description", content: "Claim your rewards." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Rewards"
        title="Rewards vault, opening soon."
        description="Daily XP, bonus loot, and surprise unlocks will live here with cinematic celebrations."
        character="neo"
        tone="reflect"
      />
    </AppShell>
  ),
});
