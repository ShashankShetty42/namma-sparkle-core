import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/activity-library")({
  head: () => ({ meta: [{ title: "Admin · Activity Library · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Activity Library"
      title="Original activities for CT, AI literacy, reflection, projects and gamified challenges."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="explore"
      
    />
  ),
});
