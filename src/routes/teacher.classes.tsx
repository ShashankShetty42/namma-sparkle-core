import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/classes")({
  head: () => ({ meta: [{ title: "Teacher · My Classes · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · My Classes"
      title="Every class you teach, current week, and pending updates."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="explore"
      
    />
  ),
});
