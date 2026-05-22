import * as React from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/namma-logo.png";

/**
 * Official Namma AI logo. Used wherever the brand is signified — sidebar,
 * auth screens, loading portals, onboarding hand-off, footers.
 *
 * The portal palette stays as-is; the logo is the brand anchor.
 */
export function BrandMark({
  className,
  size = 40,
  glow = true,
  alt = "Namma AI",
}: {
  className?: string;
  size?: number;
  glow?: boolean;
  alt?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-bonus/30 via-challenge/20 to-explore/30 blur-md"
        />
      )}
      <img
        src={logo}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-contain drop-shadow-[0_4px_10px_rgba(30,40,90,0.18)] select-none"
        draggable={false}
      />
    </span>
  );
}
