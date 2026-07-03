import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/workbook")({
  head: () => ({ meta: [{ title: "Student · Workbook Check-ins · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Workbook Check-ins"
      title="Mark your workbook progress and wait for your teacher's approval."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="reflect"
      
    />
  ),
});
