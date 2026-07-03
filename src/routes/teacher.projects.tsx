import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/projects")({
  head: () => ({ meta: [{ title: "Teacher · Projects · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Projects"
      title="Review submitted projects with rubric scoring, comments and revisions."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="bonus"
      
    />
  ),
});
