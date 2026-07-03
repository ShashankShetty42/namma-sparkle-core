import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/planner")({
  head: () => ({ meta: [{ title: "Teacher · Weekly Planner · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Weekly Planner"
      title="Plan the week: CT / AI / project focus, workbook pages, portal activities and assessments."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="decide"
      
    />
  ),
});
