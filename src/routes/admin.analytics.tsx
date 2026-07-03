import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Admin · Analytics · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · Analytics"
      title="Platform-wide analytics: adoption, active schools, weekly completion, project throughput."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="success"
      
    />
  ),
});
