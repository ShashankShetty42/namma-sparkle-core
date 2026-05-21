import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface SystemSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function SystemSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: SystemSectionProps) {
  return (
    <section className={cn("section-panel", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            <span>{eyebrow}</span>
          </div>
          <div className="space-y-2">
            <h2 className="section-title">{title}</h2>
            <p className="section-copy">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
