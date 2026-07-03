import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/projects")({
  head: () => ({ meta: [{ title: "Principal · Projects · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · Projects"
      title="School-wide project submissions, review status and approval throughput."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="explore"
      
    />
  ),
});
