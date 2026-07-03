import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/report-templates")({
  head: () => ({ meta: [{ title: "Admin · Report Templates · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Report Templates"
      title="Template library for school, grade, teacher, student and project reports."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="xp"
      
    />
  ),
});
