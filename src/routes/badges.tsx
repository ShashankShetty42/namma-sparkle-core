import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Badges — Namma AI" },
      { name: "description", content: "Earned and upcoming badges." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Badges"
        title="Your trophy shelf is filling up."
        description="A magical wall of earned badges with unlock conditions and celebratory reveals — arriving soon."
        character="dev"
        tone="bonus"
      />
    </AppShell>
  ),
});
