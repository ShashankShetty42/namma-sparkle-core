import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/reports")({
  head: () => ({ meta: [{ title: "Teacher · Reports · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Reports"
      title="Class, project and student reports — export to PDF or CSV."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="xp"
      
    />
  ),
});
