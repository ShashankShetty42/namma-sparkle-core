import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/journal")({
  head: () => ({ meta: [{ title: "Teacher · Observation Journal · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Observation Journal"
      title="Qualitative competency notes: pattern recognition, decomposition, ethics, collaboration."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="explore"
      
    />
  ),
});
