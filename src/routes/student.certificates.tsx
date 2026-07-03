import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/student/certificates")({
  head: () => ({ meta: [{ title: "Student · Certificates · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Student · Certificates"
      title="Your progress toward participation, CT and AI foundations certificates."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="xp"
      
    />
  ),
});
