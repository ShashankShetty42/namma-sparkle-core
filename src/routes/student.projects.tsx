import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/projects")({
  head: () => ({ meta: [{ title: "Student · Projects · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Projects"
      title="Submit projects, upload evidence, view teacher feedback."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="bonus"
      
    />
  ),
});
