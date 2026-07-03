import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/principal")({
  head: () => ({ meta: [{ title: "Principal · Namma AI" }] }),
  component: () => <Outlet />,
});
