import { createFileRoute, notFound, useParams } from "@tanstack/react-router";

import { AppShell } from "@/components/namma/app-shell";
import { ACTIVITIES } from "@/components/namma/activity/lesson-data";
import { LessonFrame } from "@/components/namma/activity/lesson-frame";

export const Route = createFileRoute("/activities/$slug")({
  beforeLoad: ({ params }) => {
    if (!ACTIVITIES[params.slug]) throw notFound();
  },
  head: ({ params }) => {
    const activity = ACTIVITIES[params.slug];
    return {
      meta: [
        { title: `${activity?.meta.title ?? "Activity"} · Namma AI` },
        { name: "description", content: activity?.blurb ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="shell-inner">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 text-center">
          <h1 className="font-display text-2xl font-bold">Activity not found</h1>
          <p className="text-sm text-muted-foreground">Head back to your journey to pick another one.</p>
        </div>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="shell-inner">
        <div className="rounded-3xl border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-semibold text-destructive">Something went wrong: {error.message}</p>
        </div>
      </div>
    </AppShell>
  ),
  component: ActivityPage,
});

function ActivityPage() {
  const { slug } = useParams({ from: "/activities/$slug" });
  const activity = ACTIVITIES[slug];
  if (!activity) return null;
  return (
    <AppShell>
      <LessonFrame meta={activity.meta} cards={activity.cards} slug={activity.slug} />
    </AppShell>
  );
}
