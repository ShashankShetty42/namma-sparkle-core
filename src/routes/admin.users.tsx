import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Admin · User Management · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Admin · User Management"
      title="Manage principals, teachers, students and Namma AI staff accounts."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="challenge"
      
    />
  ),
});
