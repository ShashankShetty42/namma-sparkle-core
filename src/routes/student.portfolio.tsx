import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/portfolio")({
  head: () => ({ meta: [{ title: "Student · Portfolio · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Portfolio"
      title="Everything your teacher has approved — reflections, projects, certificates and badges."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="success"
      
    />
  ),
});
