import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/workbook")({
  head: () => ({ meta: [{ title: "Teacher · Workbook Tracker · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Workbook Tracker"
      title="Track CBSE workbook completion at class and student level."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="challenge"
      
    />
  ),
});
