import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/")({
  head: () => ({ meta: [{ title: "School Implementation Dashboard · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · School Implementation"
      title="See CT & AI implementation across your school."
      description="A single view of grades, teachers, students, workbook completion, project progress and evidence readiness — built for school leadership."
      tone="bonus"
      step="Building next: full Principal Dashboard (build order · step 1)"
    />
  ),
});
