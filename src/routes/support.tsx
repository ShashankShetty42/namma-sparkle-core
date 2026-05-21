import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/namma/app-shell";
import { PagePlaceholder } from "@/components/namma/page-placeholder";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & Support — Namma AI" },
      { name: "description", content: "We're here to help." },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        eyebrow="Help & Support"
        title="We&apos;re right here with you."
        description="FAQs, guided help, parent and teacher resources, and live support — landing in a future phase."
        character="dev"
        tone="story"
      />
    </AppShell>
  ),
});
