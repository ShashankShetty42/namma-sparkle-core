import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/assessments")({
  head: () => ({ meta: [{ title: "Teacher · Assessments · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Assessments"
      title="Manage weekly assessments and record student results."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="success"
      
    />
  ),
});
