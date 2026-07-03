import { createFileRoute } from "@tanstack/react-router";
import { RoleShellPlaceholder } from "@/components/namma/role-shell-placeholder";

export const Route = createFileRoute("/principal/students")({
  head: () => ({ meta: [{ title: "Principal · Students · Namma AI" }] }),
  component: () => (
    <RoleShellPlaceholder
      eyebrow="Principal · Students"
      title="School-wide student roster with implementation status."
      description="This screen is part of the platform structure and will be built out in the next build step."
      tone="reflect"
      
    />
  ),
});
