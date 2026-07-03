import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/teachers")({
  head: () => ({ meta: [{ title: "Principal · Teachers · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · Teachers"
      title="Track teacher activity: workbook updates, project reviews, pending students."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="decide"
      
    />
  ),
});
