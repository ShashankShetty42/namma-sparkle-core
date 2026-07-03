import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/reports")({
  head: () => ({ meta: [{ title: "Principal · Reports · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · Reports"
      title="Download school, grade, teacher and student reports as PDF or CSV."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="xp"
      
    />
  ),
});
