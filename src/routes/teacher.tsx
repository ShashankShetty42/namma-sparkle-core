import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher")({
  head: () => ({ meta: [{ title: "Teacher · Namma AI" }] }),
  component: () => <Outlet />,
});
