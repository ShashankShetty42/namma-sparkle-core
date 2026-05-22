import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Namma AI" },
      { name: "description", content: "Your explorer profile." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Profile"
        title="Your explorer card is coming soon."
        description="Avatar, stats, achievements, and personalization will live here."
        character="anaya"
        tone="story"
      />
    </AppShell>
  ),
});
