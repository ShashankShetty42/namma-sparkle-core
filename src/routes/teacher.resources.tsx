import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/teacher/resources")({
  head: () => ({ meta: [{ title: "Teacher · Resource Library · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Teacher · Resource Library"
      title="Original support resources: discussion prompts, rubrics, parent templates, project ideas."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="story"
      
    />
  ),
});
