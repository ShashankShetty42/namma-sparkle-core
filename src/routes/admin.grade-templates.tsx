import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/grade-templates")({
  head: () => ({ meta: [{ title: "Admin · Grade Templates · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Grade Templates"
      title="Define reusable grade structures — weeks, missions and outcomes for Grades 3–8."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="bonus"
      
    />
  ),
});
