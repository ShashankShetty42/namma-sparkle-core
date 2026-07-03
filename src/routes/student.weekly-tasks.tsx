import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/weekly-tasks")({
  head: () => ({ meta: [{ title: "Student · Weekly Tasks · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Weekly Tasks"
      title="This week's checklist: workbook, teacher check-in, portal activity, reflection and project."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="decide"
      
    />
  ),
});
