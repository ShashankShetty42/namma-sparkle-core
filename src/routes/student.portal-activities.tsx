import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/portal-activities")({
  head: () => ({ meta: [{ title: "Student · Portal Activities · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Portal Activities"
      title="Interactive CT & AI activities linked to your workbook missions."
      description="Scan a workbook QR code to launch the matching portal activity, earn badges and unlock the next mission."
      tone="challenge"
      step="Coming in Namma AI Learning Pack · 2027–28"
    />
  ),
});
