import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions — Namma AI" },
      { name: "description", content: "Your active AI missions." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Missions"
        title="3 missions are waiting for you."
        description="Mission flow with weekly progression, objectives, and character cues will land here next."
        character="neo"
        tone="challenge"
      />
    </AppShell>
  ),
});
