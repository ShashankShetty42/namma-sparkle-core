import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/settings")({
  head: () => ({ meta: [{ title: "Principal · Settings · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · Settings"
      title="School profile, academic year, notification preferences."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="decide"
      
    />
  ),
});
