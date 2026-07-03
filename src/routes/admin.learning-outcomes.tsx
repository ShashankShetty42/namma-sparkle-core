import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/learning-outcomes")({
  head: () => ({ meta: [{ title: "Admin · Learning Outcomes · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Learning Outcomes"
      title="Author neutral CT & AI learning outcomes that map to school implementation."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="decide"
      
    />
  ),
});
