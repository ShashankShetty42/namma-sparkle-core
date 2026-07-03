import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/support")({
  head: () => ({ meta: [{ title: "Admin · Support · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Support"
      title="Support tickets from schools, teachers and students."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="story"
      
    />
  ),
});
