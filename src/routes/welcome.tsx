import { createFileRoute, redirect } from "@tanstack/react-router";

// Phase 1: skip the marketing welcome and land directly on the Command Centre login.
export const Route = createFileRoute("/welcome")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
