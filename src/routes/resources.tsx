import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Namma AI" },
      { name: "description", content: "Learning resources and references." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Resources"
        title="A library of AI wonders awaits."
        description="Curated explainers, reference cards, and downloadable workbooks are being prepared."
        character="anaya"
        tone="explore"
      />
    </AppShell>
  ),
});
